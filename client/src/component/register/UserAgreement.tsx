import {useEffect, useState} from 'react'
import axios from 'axios';

//mui
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import CheckIcon from '@mui/icons-material/Check';
import ToggleButton from '@mui/material/ToggleButton';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import ClickAwayListener from '@mui/base/ClickAwayListener'; //외부클릭
import Box from "@mui/material/Box";

//redux store
import { useSelector,useDispatch} from 'react-redux';
import {RootState} from '../../store/store'
import RegisterMenuSlice from '../../store/RegisterMenuSlice';
import RegisterAgreeSlice from '../../store/RegisterAgreeSlice';


export default function UserAgreement(){
    const dispatch = useDispatch()
    const [warning,setWarning] = useState<boolean>(false)
    const [allAgree,setAllAgree] = useState<boolean>(false)//전체 동의
    const personalInfoAgree = useSelector<RootState,boolean>(state=>{return state.agreement.personalinfo})//개인정보동의
    const locationInfoAgree = useSelector<RootState,boolean>(state=>{return state.agreement.locationinfo})//위치정보동의
    const receiveAgree = useSelector<RootState,boolean>(state=>{return state.agreement.receive})//수신동의

    const handleClickAway = () => {
        setWarning(false);
      };

    const submit = async ()=>{
        if(personalInfoAgree){
            dispatch(RegisterAgreeSlice.actions.personal(true)) //개인정보동의 수락 
            if(locationInfoAgree){dispatch(RegisterAgreeSlice.actions.location(true))} //위치정보동의 수락
            if(receiveAgree){dispatch(RegisterAgreeSlice.actions.receive(true))} //수신동의 수락
            dispatch(RegisterMenuSlice.actions.inputInfo()) //회원정보입력창 이동 
        }else{
            setWarning(true)

        }
    }


    useEffect(()=>{
        if(allAgree){
            dispatch(RegisterAgreeSlice.actions.personal(true))
            dispatch(RegisterAgreeSlice.actions.location(true))
            dispatch(RegisterAgreeSlice.actions.receive(true))
        }else{
            dispatch(RegisterAgreeSlice.actions.personal(false))
            dispatch(RegisterAgreeSlice.actions.location(false))
            dispatch(RegisterAgreeSlice.actions.receive(false))
        }
    },[allAgree])


    return <>
                <ToggleButton
                sx={{mb:1,width:"100%",alignItems:"start",fontWeight:"bold"}}
                    value="check"
                    selected={allAgree}
                    onChange={() => {
                        setAllAgree(!allAgree);
                    }}
                    >
                    <CheckIcon />개인정보사용, 위치정보확인, 정보수신 전체동의
                </ToggleButton>
                <ToggleButton
                    sx={{mb:1,width:"100%"}}
                    value="check"
                    selected={personalInfoAgree}
                    onChange={() => {
                        dispatch(RegisterAgreeSlice.actions.personal(!personalInfoAgree));
                    }}
                    >
                    <CheckIcon /> 개인정보 수집 동의<Box component="span" fontSize="5px" color="green">(필수)</Box>
                </ToggleButton>
                <ToggleButton
                sx={{mb:1, width:"100%", textAlign:"start"}}
                    value="check"
                    selected={locationInfoAgree}
                    onChange={() => {
                        dispatch(RegisterAgreeSlice.actions.location(!locationInfoAgree));
                    }}
                    >
                    <CheckIcon /> 위치정보 확인 동의<Box component="span" fontSize="5px" >(선택)</Box>
                </ToggleButton>
                <ToggleButton
                sx={{mb:1,width:"100%"}}
                    value="check"
                    selected={receiveAgree}
                    onChange={() => {
                        dispatch(RegisterAgreeSlice.actions.receive(!receiveAgree));
                    }}
                    >
                    <CheckIcon />정보 수신 동의<Box component="span" fontSize="5px" >(선택)</Box>
                </ToggleButton>

                <ButtonGroup sx={{mb:1,width:"100%"}} variant="contained" aria-label="outlined primary button group">
                    <Button sx={{width:"50%"}}>취소</Button>
                    <Button sx={{width:"50%"}} onClick={submit}>확인</Button>
                </ButtonGroup>
                {warning? <ClickAwayListener onClickAway={handleClickAway}>
                        <Stack sx={{ width: '100%' }} spacing={2}>
                            <Alert severity="warning" onClick={()=>{setWarning(false)}}>
                                <AlertTitle>가입안내</AlertTitle>
                                "개인정보사용에 동의해 주셔야 가입이 가능합니다."
                            </Alert>
                        </Stack>
                    </ClickAwayListener>:<></>}


    </>
}