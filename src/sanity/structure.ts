import type { StructureResolver } from 'sanity/structure'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      // ─── Singletons (no Create, no Delete) ───────────────────────────────
      S.listItem()
        .title('Advisory Board Page')
        .id('advisoryBoardPage')
        .child(
          S.document()
            .schemaType('advisoryBoardPage')
            .documentId('advisoryBoardPage'),
        ),
      S.divider(),
      // ─── Repeatable collections ───────────────────────────────────────────
      S.documentTypeListItem('advisoryBoardMember').title('Advisory Board Members'),
      S.divider(),
      // ─── All other document types ─────────────────────────────────────────
      ...S.documentTypeListItems().filter(
        (item) =>
          item.getId() !== 'advisoryBoardPage' &&
          item.getId() !== 'advisoryBoardMember',
      ),
    ])
