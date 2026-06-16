// =========================================================================
// CV data model — TypeScript interfaces describing the shape of the JSON
// returned from `/api/cv` on the ASP.NET Core back end.
//
// DESIGN NOTES
//
// 1. Hand-rolled vs. generated.
//    We could generate these types automatically from the back end's
//    OpenAPI / Swagger spec (using tools like `openapi-typescript` or
//    NSwag) so that the front end and back end stay in lockstep without
//    manual edits. For this project — a single CV endpoint, owned and
//    edited by one person — the maintenance cost of hand-rolling these
//    interfaces is smaller than the build-step overhead of a generator.
//    The trade-off would flip if the DTO surface grew (ten-plus
//    endpoints, frequently-changing fields), and the right move at that
//    point would be to switch to code generation.
//
// 2. Compile-time only.
//    Everything in this file is erased at compile time. None of it ships
//    to the browser at runtime. It exists purely as a contract between
//    this file's author and the TypeScript compiler — autocomplete in
//    templates, typo detection, "you forgot a field" errors.
//
// 3. Sanitization is not done here.
//    A TypeScript interface cannot stop a server from sending data it
//    should not send. The C# DTO classes on the back end
//    (backend/Models/*.cs) are the real sieve: ASP.NET Core's
//    serializer can only emit fields that exist on the DTO, so any
//    sensitive field absent from the DTO never reaches the wire. These
//    TypeScript interfaces mirror those C# DTOs; the C# is the source
//    of truth, and any sanitization story lives there, not here.
//
// 4. `html` fields are trusted by construction.
//    Several fields below accept inline HTML (<strong>, <em>, links,
//    etc.) so prose can stay legible without splitting into many small
//    structural fields. The trust model is: the CV owner authors the
//    content; the back end serves it verbatim; the front end renders
//    it with [innerHTML]. This is safe because there is exactly one
//    author and zero user-generated content. If this site ever grew a
//    public-input feature, every `html` field would need a sanitizer
//    (DOMPurify, or Angular's DomSanitizer with a strict allow-list)
//    at render time.
// =========================================================================

export interface CvData {
  header: HeaderData;
  summary: string;
  selectedWork: WorkEntry[];
  stackMap: StackRow[];
  education: EducationEntry[];
  other: OtherEntry[];
}

export interface HeaderData {
  name: string;
  tagline: string;
  email: string;
  phone: string;
  location: string;
  links: ContactLink[];
  photoUrl: string;
}

export interface ContactLink {
  label: string;
  url?: string;
}

export interface WorkEntry {
  id: string;
  title: string;
  titleLink?: ContactLink;
  meta: string;
  blocks: ContentBlock[];
  scope: string;
}

export type ContentBlock =
  | { type: 'paragraph'; html: string }
  | { type: 'punch'; html: string }
  | { type: 'dashList'; items: string[] };

export interface StackRow {
  label: string;
  description: string;
}

export interface EducationEntry {
  degree: string;
  qualifier?: string;
  institution: string;
  dates: string;
}

export interface OtherEntry {
  label: string;
  body: string;
}
