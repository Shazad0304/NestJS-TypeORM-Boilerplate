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

export async function getPaginatedResultWithFind(repo : any, paginaton : PaginationRequest,find : any): Promise<PaginatedResult>{
    
    let condition = "";
    let keys = Object.keys(find);

    if(keys.length > 1){
        
        for(let key of keys){
            condition = condition + `${key} = ${typeof find[key] === 'string' ? `'${find[key]}'` : find[key]} ${key === keys[keys.length - 1] ? '' : ' and '}`
        }
    }
    else{
            condition =  `${keys[0]} = ${typeof find[keys[0]] === 'string' ? `'${find[keys[0]]}'` : find[keys[0]]}`;
    }
    

    const skippedItems = (paginaton.page - 1) * paginaton.limit;
    const totalCount = await repo.count(find);
    const items = await repo.createQueryBuilder()
    .where(condition)
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
