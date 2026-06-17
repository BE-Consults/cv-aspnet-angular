// =========================================================================
// Source-pointer metadata.
//
// One entry per major section of the page. Each entry maps the rendered
// section to the back-end file (where the data lives) and the front-end
// file (where it is rendered). The source-pointer component turns these
// into GitHub deep-links when inspect mode is on.
//
// File paths are repo-relative. The repo root is encoded in
// `source-pointer.ts` so we only have to update one place if the repo
// moves orgs or renames.
// =========================================================================

export interface SourceMeta {
  /** Short label shown in the badge, e.g. "HEADER". */
  readonly label: string;
  /** Repo-relative path to the back-end source. */
  readonly backendFile?: string;
  /** Symbol within the back-end file — DTO, property name, etc. */
  readonly backendSymbol?: string;
  /** Repo-relative path to the front-end component. */
  readonly frontendFile?: string;
}

export const SOURCE_META: Readonly<Record<string, SourceMeta>> = {
  header: {
    label: 'HEADER',
    backendFile: 'backend/Data/CvSource.cs',
    backendSymbol: 'HeaderDto',
    frontendFile: 'frontend/src/app/cv/header.ts',
  },
  summary: {
    label: 'SUMMARY',
    backendFile: 'backend/Data/CvSource.cs',
    backendSymbol: 'CvDto.Summary',
    frontendFile: 'frontend/src/app/cv/summary.ts',
  },
  selectedWork: {
    label: 'SELECTED WORK',
    backendFile: 'backend/Data/CvSource.cs',
    backendSymbol: 'CvDto.SelectedWork',
    frontendFile: 'frontend/src/app/cv/selected-work.ts',
  },
  stackMap: {
    label: 'STACK',
    backendFile: 'backend/Data/CvSource.cs',
    backendSymbol: 'CvDto.StackMap',
    frontendFile: 'frontend/src/app/cv/stack-map.ts',
  },
  education: {
    label: 'EDUCATION',
    backendFile: 'backend/Data/CvSource.cs',
    backendSymbol: 'CvDto.Education',
    frontendFile: 'frontend/src/app/cv/education.ts',
  },
  other: {
    label: 'OTHER',
    backendFile: 'backend/Data/CvSource.cs',
    backendSymbol: 'CvDto.Other',
    frontendFile: 'frontend/src/app/cv/other.ts',
  },
};
