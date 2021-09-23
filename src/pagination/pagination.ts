export class PaginationRequest {
    page!: number
    limit!: number
}

export class PaginatedResult {
    data!: any[]
    page!: number
    limit!: number
    totalCount!: number
  }


export async function getPaginatedResult(repo : any, paginaton : PaginationRequest): Promise<PaginatedResult>{
    
    const skippedItems = (paginaton.page - 1) * paginaton.limit;
    const totalCount = await repo.count();
    const items = await repo.createQueryBuilder()
    .offset(skippedItems)
    .limit(paginaton.limit)
    .getMany()

  return {
    totalCount,
    page: paginaton.page,
    limit: paginaton.limit,
    data: items,
  }

}
