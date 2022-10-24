type Articles = {
    flag: boolean
    article: string[]
}
type Model = {
    result_model: {
        article_info: {
            title: string
            article_id: string
            brief_content: string
            view_count: number
            digg_count: number
            comment_count: number
        }
        author_user_info: {
            user_name: string
        }
    }
}
type JueJinSearch = {
    data: Model[]
    err_no: number
}
type ArticleTemp = (
    id: string,
    title: string,
    abstract: string,
    author: string,
    viewCounts: number,
    likeCounts: number,
    commentCounts: number
) => string

export {
    Articles,
    Model,
    JueJinSearch,
    ArticleTemp
}
