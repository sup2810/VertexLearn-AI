import { useEffect } from 'react'
import axios from 'axios'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { setCourseData } from '../redux/courseSlice'

const getPublishedCourse = () => {
    const dispatch = useDispatch()
    const { userData } = useSelector(state => state.user)

    // BUG FIX: userData load hone ke baad fetch karo
    useEffect(() => {
        const getCourseData = async () => {
            try {
                const result = await axios.get(serverUrl + "/api/course/getpublished", { withCredentials: true })
                dispatch(setCourseData(result.data))
            } catch (error) {
                console.log(error)
            }
        }
        getCourseData()
    }, [userData])  // userData change hone par re-fetch
}

export default getPublishedCourse
