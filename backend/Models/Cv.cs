// =========================================================================
// CV data transfer objects.
// Shape of the JSON returned from /api/cv. Canonical wire contract.
//
// DESIGN NOTES
//
// 1. Records, not classes or structs.
//    Class would force us to hand-write equality, GetHashCode, ToString,
//    and a constructor for every DTO. Record gives that for free.
//    Record struct would copy the whole graph on every parameter pass —
//    wrong tradeoff for a tree that the singleton emits unchanged on
//    every request, especially when most fields (string, IReadOnlyList)
//    are reference types already and gain nothing from a value wrapper.
//
// 2. All DTOs in one file.
//    One contract, one file. Split if the DTOs grow validation
//    attributes, converters, or factory methods.
//
// 3. ContentBlock is a string-tagged record, not a polymorphic hierarchy.
//    The polymorphic alternative (abstract base + derived records +
//    [JsonPolymorphic]) is more type-safe in C# but produces noisier
//    JSON and does not match the TypeScript discriminated union the
//    front end is built around. Flat string tag mirrors the wire format
//    exactly. We accept that a "paragraph" record could in theory carry
//    an Items array — one author, no untrusted producers.
//
// 4. IReadOnlyList<T>, not List<T>.
//    Public surface signals "snapshot, do not mutate."
//
// 5. No validation attributes.
//    Response-only DTOs. Validation belongs on incoming request DTOs
//    (currently none). A future inbound POST/PUT would get its own type
//    with [Required] / [StringLength] / FluentValidation.
// =========================================================================

using System.Text.Json.Serialization;

namespace BScottCv.Models;

public record CvDto(
    HeaderDto Header,
    string Summary,
    IReadOnlyList<WorkEntryDto> SelectedWork,
    IReadOnlyList<StackRowDto> StackMap,
    IReadOnlyList<EducationEntryDto> Education,
    IReadOnlyList<OtherEntryDto> Other
);

public record HeaderDto(
    string Name,
    string Tagline,
    string Email,
    string Phone,
    string Location,
    IReadOnlyList<ContactLinkDto> Links,
    string PhotoUrl
);

public record ContactLinkDto(
    string Label,
    string? Url = null
);

public record WorkEntryDto(
    string Id,
    string Title,
    string Meta,
    IReadOnlyList<ContentBlockDto> Blocks,
    string Scope,
    ContactLinkDto? TitleLink = null
);

// String-discriminated union. See design note 3 above.
// Html is populated for Type = "paragraph" | "punch".
// Items is populated for Type = "dashList".
public record ContentBlockDto(
    string Type,
    string? Html = null,
    IReadOnlyList<string>? Items = null
);

public record StackRowDto(
    string Label,
    string Description
);

public record EducationEntryDto(
    string Degree,
    string Institution,
    string Dates,
    string? Qualifier = null
);

public record OtherEntryDto(
    string Label,
    string Body
);
