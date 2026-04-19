import DestinationCard from '../DestinationCard'
import LoadingSpinner from '../LoadingSpinner'
import NoResults from './NoResults'

const DestinationGrid = ({ destinations, loading, search, onClearFilters }) => {
  if (loading) {
    return (
      <div className="col-span-full">
        <LoadingSpinner message="Loading destinations..." />
      </div>
    )
  }

  if (destinations.length === 0) {
    return (
      <NoResults
        search={search}
        onClear={onClearFilters}
      />
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {destinations.map((dest) => (
        <DestinationCard key={dest._id} dest={dest} />
      ))}
    </div>
  )
}

export default DestinationGrid