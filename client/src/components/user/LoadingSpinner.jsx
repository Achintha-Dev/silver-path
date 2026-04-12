const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] gap-4">
      <div className="w-10 h-10 border-4 border-white/20 border-t-green-400 rounded-full animate-spin" />
      <p className="text-white/60 text-sm font-medium tracking-widest uppercase">
        {message}
      </p>
    </div>
  )
}

export default LoadingSpinner