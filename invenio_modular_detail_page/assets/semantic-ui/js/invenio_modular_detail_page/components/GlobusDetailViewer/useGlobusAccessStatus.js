import { useState, useEffect } from "react";
import apiClient from "@js/kcworks/utils/apiClient"; 

export const GLOBUS_LOADING_STATES = {
  LOADING: "LOADING",
  REDIRECT: "REDIRECT",
  NO_PERMISSION: "NO_PERMISSION",
  READY: "READY",
  FAILED_LOGIN: "FAILED_LOGIN"
};

export const useGlobusAccessStatus = (endpointId) => {
  const [status, setStatus] = useState(GLOBUS_LOADING_STATES.LOADING);
  const [rootFiles, setRootFiles] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!endpointId) return;

    let isMounted = true;
    setStatus(GLOBUS_LOADING_STATES.LOADING);

    const hasRedirected = sessionStorage.getItem("globus_auth_redirected");

    apiClient.get('/globus/endpoints')
      .then(() => {
        if (hasRedirected) sessionStorage.removeItem("globus_auth_redirected");
        if (isMounted) checkUserCollectionAccess();
      })
      .catch((err) => {
        if (isMounted) {
          if (hasRedirected) {
            sessionStorage.removeItem("globus_auth_redirected");
            setStatus(GLOBUS_LOADING_STATES.FAILED_LOGIN);
          } else {
            sessionStorage.setItem("globus_auth_redirected", "true");
            setStatus(GLOBUS_LOADING_STATES.REDIRECT);
          }
        }
      });

    const checkUserCollectionAccess = () => {
      apiClient.get(`/api/globus/ls/${endpointId}`, { params: { path: "/" } })
        .then((response) => {
          if (isMounted) {
            setRootFiles(response.data);
            setStatus(GLOBUS_LOADING_STATES.READY);
          }
        })
        .catch((err) => {
          if (isMounted) {
            const errStatus = err.response?.status;
            if (errStatus === 403 || errStatus === 401) {
              setStatus(GLOBUS_LOADING_STATES.NO_PERMISSION);
            } else {
              setError("Failed to load directory contents.");
              setStatus(GLOBUS_LOADING_STATES.NO_PERMISSION);
            }
          }
        });
    };

    return () => { isMounted = false; };
  }, [endpointId]);

  return { status, rootFiles, error };
};