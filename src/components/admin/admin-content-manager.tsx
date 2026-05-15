"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  saveAboutContentAction,
  saveContactInfoAction,
  saveHomepageContentAction,
  saveSiteSettingsAction,
  saveSocialLinksAction
} from "@/features/admin/actions";
import type {
  AboutContent,
  ContactInfo,
  HomepageContent,
  SiteSettings,
  SocialLink
} from "@/types/cms";

export function AdminContentManager({
  homepage,
  about,
  contact,
  settings,
  socialLinks
}: {
  homepage: HomepageContent;
  about: AboutContent;
  contact: ContactInfo;
  settings: SiteSettings;
  socialLinks: SocialLink[];
}) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  function submit(
    event: React.FormEvent<HTMLFormElement>,
    action: (formData: FormData) => Promise<{ ok: boolean; message: string }>
  ) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(async () => {
      const result = await action(formData);
      setMessage(result.message);
      if (result.ok) {
        router.refresh();
      }
    });
  }

  return (
    <div className="space-y-7">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-gallery-accent">
          Editorial CMS
        </p>
        <h1 className="mt-2 font-serif text-4xl font-light">Site Content</h1>
        <p className="mt-2 text-sm text-gallery-muted">
          Edit homepage hero text, page copy, contact details, social links, and global SEO.
        </p>
      </div>

      {message ? (
        <div className="luxury-panel px-4 py-3 font-mono text-[12px] text-gallery-accent" role="status">
          {message}
        </div>
      ) : null}

      <form onSubmit={(event) => submit(event, saveHomepageContentAction)} className="luxury-panel grid gap-4 p-5">
        <h2 className="font-serif text-2xl font-light">Homepage</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Field name="heroTitle" label="Hero title" defaultValue={homepage.heroTitle} />
          <Field name="featuredSectionTitle" label="Featured label" defaultValue={homepage.featuredSectionTitle} />
        </div>
        <TextArea name="heroSubtitle" label="Hero subtitle" defaultValue={homepage.heroSubtitle} />
        <div className="grid gap-4 md:grid-cols-2">
          <Field name="heroCtaLabel" label="CTA label" defaultValue={homepage.heroCtaLabel} />
          <Field name="heroCtaHref" label="CTA href" defaultValue={homepage.heroCtaHref} />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Field name="seoTitle" label="SEO title" defaultValue={homepage.seoTitle} />
          <Field name="seoDescription" label="SEO description" defaultValue={homepage.seoDescription} />
        </div>
        <SaveButton pending={pending} />
      </form>

      <form onSubmit={(event) => submit(event, saveAboutContentAction)} className="luxury-panel grid gap-4 p-5">
        <h2 className="font-serif text-2xl font-light">About Page</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Field name="label" label="Label" defaultValue={about.label} />
          <Field name="title" label="Title" defaultValue={about.title} />
          <Field name="italicTitle" label="Italic title" defaultValue={about.italicTitle} />
        </div>
        <TextArea name="body" label="Primary body" defaultValue={about.body} />
        <TextArea name="secondaryBody" label="Secondary body" defaultValue={about.secondaryBody} />
        <TextArea
          name="metrics"
          label="Metrics JSON"
          defaultValue={JSON.stringify(about.metrics, null, 2)}
          rows={5}
        />
        <div className="grid gap-4 md:grid-cols-2">
          <Field name="seoTitle" label="SEO title" defaultValue={about.seoTitle} />
          <Field name="seoDescription" label="SEO description" defaultValue={about.seoDescription} />
        </div>
        <SaveButton pending={pending} />
      </form>

      <form onSubmit={(event) => submit(event, saveContactInfoAction)} className="luxury-panel grid gap-4 p-5">
        <h2 className="font-serif text-2xl font-light">Contact Page</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Field name="heading" label="Heading" defaultValue={contact.heading} />
          <Field name="italicHeading" label="Italic heading" defaultValue={contact.italicHeading} />
          <Field name="email" label="Email" defaultValue={contact.email} />
          <Field name="instagram" label="Instagram" defaultValue={contact.instagram} />
          <Field name="location" label="Location" defaultValue={contact.location} />
          <Field name="phone" label="Phone" defaultValue={contact.phone ?? ""} />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Field name="seoTitle" label="SEO title" defaultValue={contact.seoTitle} />
          <Field name="seoDescription" label="SEO description" defaultValue={contact.seoDescription} />
        </div>
        <SaveButton pending={pending} />
      </form>

      <form onSubmit={(event) => submit(event, saveSiteSettingsAction)} className="luxury-panel grid gap-4 p-5">
        <h2 className="font-serif text-2xl font-light">Site Settings</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Field name="siteName" label="Site name" defaultValue={settings.siteName} />
          <Field name="logoText" label="Logo text" defaultValue={settings.logoText} />
          <Field name="accentColor" label="Accent color" defaultValue={settings.accentColor} />
          <Field name="ogImageUrl" label="Default OG image URL" defaultValue={settings.ogImageUrl ?? ""} />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Field name="defaultSeoTitle" label="Default SEO title" defaultValue={settings.defaultSeoTitle} />
          <Field
            name="defaultSeoDescription"
            label="Default SEO description"
            defaultValue={settings.defaultSeoDescription}
          />
        </div>
        <SaveButton pending={pending} />
      </form>

      <form onSubmit={(event) => submit(event, saveSocialLinksAction)} className="luxury-panel grid gap-4 p-5">
        <h2 className="font-serif text-2xl font-light">Social Links</h2>
        <TextArea
          name="socialLinks"
          label="Social links JSON"
          defaultValue={JSON.stringify(
            socialLinks.map((link) => ({
              label: link.label,
              url: link.url,
              sortOrder: link.sortOrder
            })),
            null,
            2
          )}
          rows={6}
        />
        <SaveButton pending={pending} />
      </form>
    </div>
  );
}

function Field({
  name,
  label,
  defaultValue
}: {
  name: string;
  label: string;
  defaultValue: string;
}) {
  return (
    <div>
      <label className="admin-label" htmlFor={name}>
        {label}
      </label>
      <input id={name} name={name} defaultValue={defaultValue} className="admin-input" />
    </div>
  );
}

function TextArea({
  name,
  label,
  defaultValue,
  rows = 4
}: {
  name: string;
  label: string;
  defaultValue: string;
  rows?: number;
}) {
  return (
    <div>
      <label className="admin-label" htmlFor={name}>
        {label}
      </label>
      <textarea id={name} name={name} defaultValue={defaultValue} rows={rows} className="admin-input" />
    </div>
  );
}

function SaveButton({ pending }: { pending: boolean }) {
  return (
    <button type="submit" className="btn btn-accent w-fit" disabled={pending}>
      {pending ? "Saving..." : "Save changes"}
    </button>
  );
}
