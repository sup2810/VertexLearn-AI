import { useEffect } from 'react'
import { serverUrl } from '../App'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setCreatorCourseData } from '../redux/courseSlice'

const getCreatorCourse = () => {
    const dispatch = useDispatch()
    const { userData } = useSelector(state => state.user)

    // BUG FIX: return (useEffect()) nahi — seedha useEffect call karo
    useEffect(() => {
        if (!userData) return   // login nahi hai toh fetch mat karo
        const creatorCourses = async () => {
            try {
                const result = await axios.get(serverUrl + "/api/course/getcreator", { withCredentials: true })
                dispatch(setCreatorCourseData(result.data))
            } catch (error) {
                console.log(error)
            }
        }
        creatorCourses()
    }, [userData])
}

export default getCreatorCourse
