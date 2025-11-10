import { Response } from "express";
import { z } from "zod";
import mongoose from "mongoose";
import PropertyModel from "../models/Property";
import { AuthRequest } from "../middleware/auth";

/* ----------------------------- helpers ----------------------------- */

const toSlug = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 90);

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

async function ensureUniqueSlug(base: string) {
  if (!base) base = "property";
  const re = new RegExp(`^${escapeRe(base)}(?:-(\\d+))?$`, "i");
  const docs = await PropertyModel.find({ slug: re }).select("slug").lean();

  if (docs.length === 0) return base;

  // find max numeric suffix and add 1
  let max = 1;
  for (const d of docs) {
    const m = (d.slug || "").match(/-(\d+)$/);
    if (m) max = Math.max(max, Number(m[1]) + 1);
    else max = Math.max(max, 2);
  }
  return `${base}-${max}`;
}

const isObjectId = (id?: string) => !!id && mongoose.Types.ObjectId.isValid(id);

const normalizeAmenities = (raw?: string[] | string) => {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw.filter(Boolean).map((s) => s.trim());
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
};

// convert uploaded filename -> public URL
const makePublicUrl = (req: AuthRequest, filename: string) => {
  const origin =
    process.env.PUBLIC_BASE_URL || `${req.protocol}://${req.get("host")}`;
  return `${origin}/uploads/properties/${filename}`;
};

const normalizeStatusInput = (v?: string) => {
  if (!v) return undefined;
  const s = v.toLowerCase();
  if (["approved", "active", "publish", "published", "live"].includes(s))
    return "approved";
  if (["pending", "pending_review", "review"].includes(s)) return "pending_review";
  if (["draft"].includes(s)) return "draft";
  if (["rejected"].includes(s)) return "rejected";
  if (["expired", "inactive", "deleted", "sold"].includes(s)) return "expired";
  return undefined;
};

/* ------------------------------ schemas ---------------------------- */

const AmenitiesSchema = z.union([z.array(z.string()), z.string()]);

const createSchema = z.object({
  title: z.string().min(5),
  slug: z.string().optional(), // auto if absent
  description: z.string().min(10),
  propertyType: z.enum(["Apartment", "House", "Plot", "Commercial", "Rent"]),
  location: z.string().min(3),
  city: z.string().optional(),
  area: z.coerce.number().min(0).optional(),
  bedrooms: z.coerce.number().int().min(0).optional(),
  bathrooms: z.coerce.number().int().min(0).optional(),
  price: z.coerce.number().positive(),
  ownerContact: z.string().min(10).optional(),
  amenities: AmenitiesSchema.optional(),
  images: z.array(z.string()).optional(), // URLs (if not uploading)
  status: z.string().optional(), // lenient; we'll normalize
});

const updateSchema = z
  .object({
    title: z.string().min(5).optional(),
    description: z.string().min(10).optional(),
    propertyType: z
      .enum(["Apartment", "House", "Plot", "Commercial", "Rent"])
      .optional(),
    location: z.string().min(3).optional(),
    area: z.coerce.number().min(0).optional(), // coerce from FormData
    price: z.coerce.number().positive().optional(), // coerce

    images: z.array(z.string()).optional(),
    amenities: AmenitiesSchema.optional(),
    city: z.string().optional(),
    slug: z.string().min(3).optional(),

    ownerContact: z.string().min(10).optional(),
    bedrooms: z.coerce.number().int().min(0).optional(),
    bathrooms: z.coerce.number().int().min(0).optional(),
    status: z
      .enum(["draft", "pending_review", "approved", "rejected", "expired"])
      .optional(),
  })
  .strict();

/* ------------------------------ controllers ------------------------ */

export const createProperty = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const data = createSchema.parse(req.body);

    const baseSlug = toSlug(data.slug || data.title);
    let finalSlug = await ensureUniqueSlug(baseSlug);

    // uploaded files + any image URLs from body
    const uploaded =
      (Array.isArray(req.files)
        ? (req.files as Express.Multer.File[]).map((f) =>
            makePublicUrl(req, f.filename)
          )
        : []) ?? [];
    const bodyImages = data.images ?? [];
    const images = [...uploaded, ...bodyImages];

    if (!images.length) {
      return res
        .status(400)
        .json({ message: "At least one image is required" });
    }

    const defaultStatus =
      (req.user as any)?.role === "admin" ? "approved" : "draft";
    const normalizedStatus =
      normalizeStatusInput(data.status) ?? defaultStatus;

    try {
      const prop = await PropertyModel.create({
        userId: req.user._id,
        title: data.title,
        slug: finalSlug,
        description: data.description,
        propertyType: data.propertyType,
        location: data.location,
        city: data.city,
        area: data.area,
        bedrooms: data.bedrooms ?? 0,
        bathrooms: data.bathrooms ?? 0,
        price: data.price,
        ownerContact: data.ownerContact,
        images,
        amenities: normalizeAmenities(data.amenities),
        status: normalizedStatus,
      });
      return res.status(201).json(prop);
    } catch (err: any) {
      // rare race on slug → retry once
      if (err?.code === 11000 && err?.keyPattern?.slug) {
        finalSlug = await ensureUniqueSlug(baseSlug);
        const prop = await PropertyModel.create({
          userId: req.user._id,
          title: data.title,
          slug: finalSlug,
          description: data.description,
          propertyType: data.propertyType,
          location: data.location,
          city: data.city,
          area: data.area,
          bedrooms: data.bedrooms ?? 0,
          bathrooms: data.bathrooms ?? 0,
          price: data.price,
          ownerContact: data.ownerContact,
          images,
          amenities: normalizeAmenities(data.amenities),
          status: normalizedStatus,
        });
        return res.status(201).json(prop);
      }
      throw err;
    }
  } catch (e: any) {
    return res
      .status(400)
      .json({ message: e?.message || "Failed to create property" });
  }
};

export const getMyProperties = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const props = await PropertyModel.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    return res.json(props);
  } catch (e: any) {
    return res.status(500).json({ message: e?.message || "Failed to fetch" });
  }
};

export const getPublicProperties = async (req: AuthRequest, res: Response) => {
  try {
    const { city, q, type, minPrice, maxPrice } = req.query as {
      city?: string;
      q?: string;
      type?: string;
      minPrice?: string;
      maxPrice?: string;
    };

    const filter: any = { status: "approved" };
    if (city) filter.city = city;
    if (type) filter.propertyType = type;
    if (q && q.trim()) {
      const r = new RegExp(q.trim(), "i");
      filter.$or = [{ title: r }, { location: r }, { description: r }];
    }
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const props = await PropertyModel.find(filter)
      .sort({ createdAt: -1 })
      .lean();
    return res.json(props);
  } catch (e: any) {
    return res.status(500).json({ message: e?.message || "Failed to fetch" });
  }
};

export const getPropertyById = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id;
    if (!isObjectId(id)) return res.status(400).json({ message: "Invalid id" });

    const prop = await PropertyModel.findById(id).lean();
    if (!prop || prop.status !== "approved")
      return res.status(404).json({ message: "Not found" });

    return res.json(prop);
  } catch (e: any) {
    return res.status(500).json({ message: e?.message || "Failed to fetch" });
  }
};

export const updateProperty = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    const id = req.params.id;
    if (!isObjectId(id)) return res.status(400).json({ message: "Invalid id" });

    const prop = await PropertyModel.findById(id);
    if (!prop) return res.status(404).json({ message: "Not found" });

    const isOwner = String(prop.userId) === String(req.user._id);
    const isAdmin = (req.user as any)?.role === "admin";
    if (!isOwner && !isAdmin) return res.status(403).json({ message: "Forbidden" });
    if (prop.status === "approved" && !isAdmin)
      return res
        .status(400)
        .json({ message: "Cannot edit approved property" });

    const body = updateSchema.parse(req.body || {});
    const update: any = { ...body };

    // append uploaded files
    const uploaded =
      (Array.isArray(req.files)
        ? (req.files as Express.Multer.File[]).map((f) =>
            makePublicUrl(req, f.filename)
          )
        : []) ?? [];

    if (body.images) {
      update.images = body.images;
    } else if (uploaded.length) {
      update.images = [...(prop.images || []), ...uploaded];
    }

    // handle slug regeneration
    if (body.title && !body.slug) {
      const base = toSlug(body.title);
      update.slug = await ensureUniqueSlug(base);
    } else if (body.slug) {
      update.slug = await ensureUniqueSlug(toSlug(body.slug));
    }

    // CSV -> array
    if (body.amenities) update.amenities = normalizeAmenities(body.amenities as any);

    // normalize status string
    if (body.status) {
      const ns = normalizeStatusInput(body.status);
      if (ns) update.status = ns;
    }

    const updated = await PropertyModel.findByIdAndUpdate(prop._id, update, {
      new: true,
      runValidators: true,
    }).lean();

    return res.json(updated);
  } catch (e: any) {
    return res.status(400).json({ message: e?.message || "Failed to update" });
  }
};

export const deleteProperty = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    const id = req.params.id;
    if (!isObjectId(id)) return res.status(400).json({ message: "Invalid id" });

    const prop = await PropertyModel.findById(id);
    if (!prop) return res.status(404).json({ message: "Not found" });

    const isOwner = String(prop.userId) === String(req.user._id);
    const isAdmin = (req.user as any)?.role === "admin";
    if (!isOwner && !isAdmin) return res.status(403).json({ message: "Forbidden" });

    prop.status = "expired"; // soft delete
    await prop.save();

    return res.json({ success: true });
  } catch (e: any) {
    return res.status(500).json({ message: e?.message || "Failed to delete" });
  }
};

/* ------------------------------- admin ------------------------------ */

export const adminAllProperties = async (_req: AuthRequest, res: Response) => {
  try {
    const props = await PropertyModel.find({}).sort({ createdAt: -1 }).lean();
    return res.json(props);
  } catch (e: any) {
    return res.status(500).json({ message: e?.message || "Failed to fetch" });
  }
};

export const adminApprove = async (_req: AuthRequest, res: Response) => {
  try {
    const id = _req.params.id;
    if (!isObjectId(id)) return res.status(400).json({ message: "Invalid id" });

    const prop = await PropertyModel.findByIdAndUpdate(
      id,
      { $set: { status: "approved" } },
      { new: true }
    ).lean();

    if (!prop) return res.status(404).json({ message: "Not found" });
    return res.json(prop);
  } catch (e: any) {
    return res.status(500).json({ message: e?.message || "Failed to approve" });
  }
};

export const adminReject = async (_req: AuthRequest, res: Response) => {
  try {
    const id = _req.params.id;
    if (!isObjectId(id)) return res.status(400).json({ message: "Invalid id" });

    const prop = await PropertyModel.findByIdAndUpdate(
      id,
      { $set: { status: "rejected" } },
      { new: true }
    ).lean();

    if (!prop) return res.status(404).json({ message: "Not found" });
    return res.json(prop);
  } catch (e: any) {
    return res.status(500).json({ message: e?.message || "Failed to reject" });
  }
};

export const adminToggleVerified = async (_req: AuthRequest, res: Response) => {
  try {
    const id = _req.params.id;
    if (!isObjectId(id)) return res.status(400).json({ message: "Invalid id" });

    const prop = await PropertyModel.findById(id);
    if (!prop) return res.status(404).json({ message: "Not found" });

    const current = (prop as any).badges || {};
    (prop as any).badges = { ...current, verified: !current.verified };
    await prop.save();

    return res.json(prop.toObject());
  } catch (e: any) {
    return res.status(500).json({ message: e?.message || "Failed to toggle" });
  }
};

export const adminTogglePremium = async (_req: AuthRequest, res: Response) => {
  try {
    const id = _req.params.id;
    if (!isObjectId(id)) return res.status(400).json({ message: "Invalid id" });

    const prop = await PropertyModel.findById(id);
    if (!prop) return res.status(404).json({ message: "Not found" });

    const current = (prop as any).badges || {};
    (prop as any).badges = { ...current, premium: !current.premium };
    await prop.save();

    return res.json(prop.toObject());
  } catch (e: any) {
    return res.status(500).json({ message: e?.message || "Failed to toggle" });
  }
};
