function PhotoImage({ fotosDir, filename, alt, className, loading, onClick, ...props }) {
  const src = `${fotosDir}/${encodeURIComponent(filename)}`
  return (
    <img
      src={src}
      alt={alt || ''}
      className={className}
      loading={loading}
      onClick={onClick}
      {...props}
    />
  )
}

export default PhotoImage
