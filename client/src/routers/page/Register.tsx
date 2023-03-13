import React, { useState,useCallback,useEffect,Component } from 'react';
import styles from "../css/Register.module.css"
import axios from 'axios';
import 'react-phone-number-input/style.css'
import PhoneInput,{ isValidPhoneNumber } from 'react-phone-number-input'

//dir
import  UserInfoInput from '../../component/register/UserInfoInput'
import UserAgreement from '../../component/register/UserAgreement'

//mui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

//redux store
import { useSelector,useDispatch} from 'react-redux';
import {RootState} from '../../store/store'
import RegisterMenuSlice from '../../store/RegisterMenuSlice';



export default function Register(){
    const RegisterMenu = useSelector<RootState,string>(state=>{return state.registermenu.menu})

    //뒤로가기 막기
    useEffect(() => {
        const preventGoBack = () => {
          // change start
          window.history.pushState(null, '', window.location.href);
          // change end
          console.log('prevent go back!');
        };
        
        window.history.pushState(null, '', window.location.href);
        window.addEventListener('popstate', preventGoBack);
        
        return () => window.removeEventListener('popstate', preventGoBack);
      }, []);  

    return <>
            <div className={styles.login_page}>
                    <form className={styles.form}>
                        {(RegisterMenu === "agreement")?<UserAgreement/>
                            :<>{(RegisterMenu === "inputInfo")?<UserInfoInput/>
                                :<>{(RegisterMenu === "finish")?<></>
                                :<>
                                </>}
                            </>}
                        </>}
                    </form>
            </div>
        </>  
}