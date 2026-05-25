import { type SchemaTypeDefinition } from 'sanity'
import { advisoryBoardMember } from '@/lib/sanity/advisoryBoardMember'
import { advisoryBoardPage } from '@/lib/sanity/advisoryBoardPage'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [advisoryBoardPage, advisoryBoardMember],
}
