const CategoryBadge = ({ category }) => {
  const styles = {
    Religious:    'badge-religious',
    Nature:       'badge-nature',
    Heritage:     'badge-heritage',
    Cultural:     'badge-cultural',
    Recreational: 'badge-recreational',
  }

  return (
    <span className={styles[category] || 'badge-ghost'}>
      {category}
    </span>
  )
}

export default CategoryBadge