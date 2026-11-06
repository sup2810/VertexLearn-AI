import axios from 'axios'
import { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice'

const getCurrentUser = () => {
    const dispatch = useDispatch()
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const result = await axios.get(serverUrl + "/api/user/getcurrentuser", { withCredentials: true })
                dispatch(setUserData(result.data))  // loading = false andar set hoga
            } catch (error) {
                console.log(error)
                dispatch(setUserData(null))          // loading = false andar set hoga
            }
        }
        fetchUser()
    }, [])
}

export default getCurrentUser
