import React from "react"

interface StarRatingProps {
  rating: number
  totalStars?: number
  onRatingChange?: (rating: number) => void
  size?: "sm" | "md" | "lg"
  interactive?: boolean
}

const StarRating: React.FC<StarRatingProps> = ({ 
  rating, 
  totalStars = 5, 
  onRatingChange,
  size = "md",
  interactive = false
}) => {
  const fullStars = Math.floor(rating)
  const partialStarWidth = (rating - fullStars) * 100

  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-6 w-6"
  }

  const sizeClass = sizeClasses[size]

  const handleClick = (starNumber: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(starNumber)
    }
  }

  return (
    <div className="flex items-center gap-1">
      {[...Array(totalStars)].map((_, index) => {
        const starNumber = index + 1
        const isFilled = starNumber <= rating
        
        return (
          <button
            key={index}
            type="button"
            onClick={() => handleClick(starNumber)}
            disabled={!interactive}
            className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'} focus:outline-none`}
          >
            <svg 
              className={`${sizeClass} ${isFilled ? 'text-yellow-400' : 'text-gray-300'}`} 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
          </button>
        )
      })}
    </div>
  )
}

export default StarRating
