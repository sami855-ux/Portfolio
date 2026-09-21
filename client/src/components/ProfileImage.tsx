import { LazyLoadImage } from "react-lazy-load-image-component"
import "react-lazy-load-image-component/src/effects/blur.css"

const mineImg = "/image.jpeg"

export default function ProfileImage() {
  return (
    <div className="relative">
      <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-full overflow-hidden border-4 border-emerald-500/20 shadow-2xl bg-zinc-900">
        <LazyLoadImage
          src={mineImg}
          alt="Samuel Tale"
          effect="blur"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  )
}
