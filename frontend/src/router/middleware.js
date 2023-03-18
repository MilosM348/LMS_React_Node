import React, {useEffect} from 'react'
import {
  Route,
  Redirect,
} from 'react-router-dom'
import { NotificationManager } from 'react-notifications'

import {getCookie, setCookie} from '../service/cookie'
import { getAuth } from '../service/string'
import { useAsync } from '../service/utils'
import siteConfig from '../config/site.config'
import {getFilter as getCompanies} from '../api/company'

const SubdomainRoute = ({ ...rest }) => {
  const {data, status, error, run} = useAsync({
    status: 'idle',
  })
  useEffect(() => {
    const host = window.location.host;
    const subdomain = host.split(".")[0];
    if (subdomain !== siteConfig.domain.split(".")[0]) {
      let oldSubdomain = getCookie('subdomain');
      if (subdomain !== oldSubdomain)
        run(getCompanies({ subdomain: subdomain }));
    }
  }, []);
  useEffect(() => {
    if (status === 'resolved') {
      let isRedirect = false
      if (data.length === 0) {
        isRedirect = true
        NotificationManager.warning("Please input correct domain with company subdomain", "Worning", 3000);
      }
      else {
        const tmp = data[0]
        setCookie("subdomain", tmp.subdomain, 1)
        if (!tmp.activate || new Date(tmp.endDate) < new Date())
          isRedirect = true
      }
      if (isRedirect) {
        let url = `${window.location.protocol}//${siteConfig.domain}${window.location.pathname}`;
        window.location = url;
      }
    }
    else if (status === 'rejected') {
      let url = `${window.location.protocol}//${siteConfig.domain}${window.location.pathname}`;
      window.location = url;
      NotificationManager.warning(error?.message, 'Worning', 3000);
      console.log(error)
    }
  })
  return (
    <Route
      {...rest}
    />
  )
}

export const AuthRoute = ({ children, ...rest }) => {
  const auth = getAuth(getCookie('auth'))

  return (
    <SubdomainRoute
      {...rest}
      render={({ location }) =>
        !auth ? (
          children
        ) : (
          (
            auth?.role === 'owner' ?
            (
              <Redirect
                to={{
                  pathname: '/assignment',
                  state: { from: location },
                }}
              />
            ):
            (
              <Redirect
                to={{
                  pathname: '/',
                  state: { from: location },
                }}
              />
            )
          )
        )
      }
    />
  );
}

export const PrivateRoute = ({ children, ...rest }) => {
  const auth = getAuth(getCookie('auth'))

  return (
    <SubdomainRoute
      {...rest}
      render={({ location }) =>
        auth ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}

export const PrivateOwnerRoute = ({ children, ...rest }) => {
  const auth = getAuth(getCookie("auth"));

  return (
    <SubdomainRoute
      {...rest}
      render={({ location }) =>
        auth ? (
          auth?.role === "owner" ? (
            children
          ) : (
            <Redirect
              to={{
                pathname: "/",
                state: { from: location },
              }}
            />
          )
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};

export const PrivateAdminRoute = ({ children, ...rest }) => {
  const auth = getAuth(getCookie('auth'))
  
  return (
    <SubdomainRoute
      {...rest}
      render={({ location }) =>
        auth ?
          (auth?.role === 'admin' ?
          (
            children
          ) :
          <Redirect
            to={{
              pathname: '/',
              state: { from: location },
            }}
          />
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}

export const PrivateTeamAdminRoute = ({ children, ...rest }) => {
  const auth = getAuth(getCookie('auth'))
  
  return (
    <SubdomainRoute
      {...rest}
      render={({ location }) =>
        auth ?
          (auth?.role === 'admin' || auth?.role === 'teamAdmin' ?
          (
            children
          ) :
          <Redirect
            to={{
              pathname: '/',
              state: { from: location },
            }}
          />
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}

export const PrivateCompanyRoute = ({ children, ...rest }) => {
  const auth = getAuth(getCookie("auth"));

  return (
    <SubdomainRoute
      {...rest}
      render={({ location }) =>
        auth ? (
          auth?.role === "company" ? (
            children
          ) : (
            <Redirect
              to={{
                pathname: "/",
                state: { from: location },
              }}
            />
          )
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};

export const PrivateCompanyAdminRoute = ({ children, ...rest }) => {
  const auth = getAuth(getCookie("auth"));

  return (
    <SubdomainRoute
      {...rest}
      render={({ location }) =>
        auth ? (
          (auth?.role === "company" || auth?.role === 'companyAdmin') ? (
            children
          ) : (
            <Redirect
              to={{
                pathname: "/",
                state: { from: location },
              }}
            />
          )
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
};
