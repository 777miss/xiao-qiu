import images from 'images'

type CreateImg = (urls: { init: string; save: string }) => void
// 以指定图片为样本，生成一张它的副本
const createImg: CreateImg = urls => {
    const { init, save } = urls
    const width = images(init).width()
    const height = images(init).height()
    images(width, height).draw(images(init), 0, 0).save(save)
}

export { createImg }
