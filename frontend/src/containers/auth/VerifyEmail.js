import React, {useEffect} from 'react'
import { useParams, useHistory } from 'react-router'
import { NotificationManager } from "react-notifications";

import { verifyEmail } from '../../api/auth'
import { useAsync } from "../../service/utils";

const VerifyEmail = () => {
  const { data, status, error, run } = useAsync({
    status: "idle",
  });
  const { token } = useParams()
  const history = useHistory()

  useEffect(() => {
    if (token && token !== '') {
      run(verifyEmail({token}))
    }
  }, [token])
  useEffect(() => {
    if (status === "resolved") {
      NotificationManager.success('Verify email success', "Worning", 3000);
      history.push("/login");
    } else if (status === "rejected") {
      console.log(error);
      NotificationManager.warning(error?.message, "Worning", 3000);
      history.push('/login')
    }
  }, [status]);
  return (
    <div>

    </div>
  )
}
export default VerifyEmail
