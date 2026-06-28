import React from 'react';
import {
  RouterProvider,
} from "react-router";
import router from './routes'



function Main() {
  return (
    <RouterProvider router={router} />
  )
}

export default Main
