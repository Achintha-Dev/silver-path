import { useState, useEffect, useRef } from 'react'
import toast from 'react-hot-toast'
import { MdLocationPin } from "react-icons/md";
import { Navigate } from 'react-router-dom';

const RIDEEGAMA = { lat: 7.5372, lng: 80.2936 }

export const useUserLocation = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [locationStatus, setLocationStatus] = useState(() => {
    return navigator.geolocation ? 'loading' : 'unavailable'
  });
  const toastShown = useRef(false)

  useEffect(() => {
    if (!navigator.geolocation) {
      return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        })
        setLocationStatus('granted');
        if (!toastShown.current) {
          toast.success('Using your current location!');
          toastShown.current = true;
        }
      },
      () => {
        setLocationStatus('denied')
        if (!toastShown.current) {
          toast('Using Rideegama as reference point', { icon: <MdLocationPin className='text-blue-500' /> });
          toastShown.current = true;
        }
      },
      { timeout: 8000, maximumAge: 300000 }
    )
  }, []);

  const referencePoint = userLocation ?? RIDEEGAMA

  return { userLocation, locationStatus, referencePoint }
}