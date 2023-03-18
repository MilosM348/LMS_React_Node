import React, {useEffect} from 'react'
import { useParams, useHistory } from 'react-router'

import { check } from '../../api/auth'
import { useAsync } from "../../service/utils";
import { setCookie } from "../../service/cookie";
import { useSetting } from "../../provider/setting";

const CheckToken = () => {
  const { data, status, error, run } = useAsync({
    status: "idle",
  });
  const { token } = useParams()
  const [, dispatch] = useSetting();
  const history = useHistory()

  useEffect(() => {
    if (token && token !== '') {
      run(check({token}))
    }
  }, [token])
  useEffect(() => {
    if (status === "resolved") {
      const user = data;
      dispatch({ type: "SET", settingName: "auth", settingData: user });
      setCookie("auth", JSON.stringify(user), 1);
      setCookie("token", token, 1);
      if (user.role === 'owner') {
        history.push('/teacher/assignment')
      }
      else if (user.role === 'student') {
        history.push("/course");
      }
      else if (user.role === "company" || user.role === "companyAdmin") {
        history.push("/company/assignment");
      }
    } else if (status === "rejected") {
      console.log(error);
      history.push('/login')
    }
  }, [status]);
  return (
    <div>

    </div>
  )
}
export default CheckToken
