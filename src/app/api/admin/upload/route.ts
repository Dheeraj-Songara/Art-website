import { NextResponse } from "next/server";
import { assertAdminForMutation } from "@/lib/auth";
import { cloudinaryDeliveryUrl, configureCloudinary, isCloudinaryConfigured } from "@/lib/cloudinary";

export async function POST(request: Request) {
  try {
    await assertAdminForMutation();

    if (!isCloudinaryConfigured()) {
      return NextResponse.json(
        { ok: false, message: "Cloudinary is not configured." },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ ok: false, message: "No image file provided." }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ ok: false, message: "Uploads must be images." }, { status: 400 });
    }

    const cloudinary = configureCloudinary();
    if (!cloudinary) {
      return NextResponse.json(
        { ok: false, message: "Cloudinary configuration failed." },
        { status: 500 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise<{
      public_id: string;
      secure_url: string;
      width: number;
      height: number;
      format: string;
      bytes: number;
    }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: process.env.CLOUDINARY_UPLOAD_FOLDER ?? "void-gallery/artworks",
          resource_type: "image",
          overwrite: false,
          eager: [
            { width: 1600, crop: "limit", fetch_format: "webp", quality: "auto:good" },
            { width: 900, height: 680, crop: "fill", fetch_format: "webp", quality: "auto:good" },
            { width: 420, height: 320, crop: "fill", fetch_format: "avif", quality: "auto:eco" }
          ],
          tags: ["void-gallery", "artwork"]
        },
        (error, uploadResult) => {
          if (error || !uploadResult) {
            reject(error ?? new Error("Upload failed."));
            return;
          }
          resolve(uploadResult);
        }
      );

      stream.end(buffer);
    });

    return NextResponse.json({
      ok: true,
      imageUrl: cloudinaryDeliveryUrl(result.public_id, { width: 1800, crop: "limit" }) ?? result.secure_url,
      thumbnailUrl:
        cloudinaryDeliveryUrl(result.public_id, { width: 700, height: 520, crop: "fill" }) ??
        result.secure_url,
      imagePublicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "Upload failed."
      },
      { status: 401 }
    );
  }
}
