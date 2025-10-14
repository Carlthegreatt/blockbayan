import React from "react"

interface StarRatingProps {
  rating: number
  totalStars?: number
}

const StarRating: React.FC<StarRatingProps> = ({ rating, totalStars = 5 }) => {
  const fullStars = Math.floor(rating)
  const partialStarWidth = (rating - fullStars) * 100

  return (
    <div className="flex items-center">
      {[...Array(totalStars)].map((_, index) => {
        const starNumber = index + 1
        if (starNumber <= fullStars) {
          // Full Star
          return (
            <svg key={index} className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
          )
        } else if (starNumber === fullStars + 1 && partialStarWidth > 0) {
          // Partial Star
          return (
            <div key={index} className="relative h-4 w-4">
              <svg className="h-full w-full text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
              <div className="absolute top-0 left-0 h-full overflow-hidden" style={{ width: `${partialStarWidth}%` }}>
                <svg className="h-full w-full text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              </div>
            </div>
          )
        } else {
          // Empty Star
          return (
            <svg key={index} className="h-4 w-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
          )
        }
      })}
    </div>
  )
}

export default StarRating
