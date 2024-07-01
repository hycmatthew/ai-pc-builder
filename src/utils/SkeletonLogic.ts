export const SkeletonLogic = (list: any[], itemNum: number) => {
    if(list.length > 0){
        return list.slice(0,itemNum)
    }
    return [...Array(itemNum)]
}
