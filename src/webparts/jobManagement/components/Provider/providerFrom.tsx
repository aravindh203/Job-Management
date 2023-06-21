import * as React from 'react';
import { useState,useEffect } from 'react';
import { TextField } from '@fluentui/react/lib/TextField';
import { Checkbox, DefaultButton } from '@fluentui/react';
import {sp} from "@pnp/sp/presets/all";
import styles from './providerForm.module.scss';

interface IProviderAdd{
    Name:string;
    PhoneNo:number;
    Email:string;
    FirstAddress:string;
    SecondAddress:string;
    Nok:boolean;
    NokName:string;
    NokPhoneNo:number;
}

const ProviderAddForm = (props:any):JSX.Element =>{
    const text={
        root:{
            ".ms-TextField-wrapper":{
                padding:'10px 0px'
            }
        }
    }
    const [error,setError] = useState<string>('')
    const [data,setData] = useState<IProviderAdd>({
        Name:'',
        PhoneNo:null,
        Email:'',
        FirstAddress:'',
        SecondAddress:'',
        Nok:false,
        NokName:'',
        NokPhoneNo:null,
    })

    const handleInputValue = (event:any):void =>{
        if(event.target.name==='Provider Name'){
            setData({...data,Name:event.target.value})
        }
        else if(event.target.name==='Phone No'){
            setData({...data,PhoneNo:event.target.value})
        }
        else if(event.target.name==='Email'){
            setData({...data,Email:event.target.value})
        }
        else if(event.target.name==='Contact Address'){ 
            setData({...data,FirstAddress:event.target.value})
        }
        else if(event.target.name==='Second Address'){
            setData({...data,SecondAddress:event.target.value})
        }
        else if(event.target.name==='Nok'){
            setData({...data,Nok:event.target.checked})
        }
        else if(event.target.name==='Nok Name'){
            setData({...data,NokName:event.target.value})
        }
        else{
            setData({...data,NokPhoneNo:event.target.value})
        }
    }

    const validation = (btnVal:string):boolean =>{
        
        let isAllValueFilled=true;
        let emailvalidation=/^([A-Za-z0-9_.])+\@([g][m][a][i][l])+\.([c][o][m])+$/;
        let addBtn = btnVal === 'Add' ? true:false;

        if(!data.Name){
            setError('please fill name')
            isAllValueFilled = false;
        }
        else if((addBtn && !(data.PhoneNo && data.PhoneNo.toString().length===10)) ||  (data.PhoneNo && data.PhoneNo.toString().length!==10)){
            setError('please enter a valid phone number')
            isAllValueFilled = false;
        }
        else if((addBtn && !(data.Email && emailvalidation.test(data.Email))) || (data.Email && !emailvalidation.test(data.Email))){
            setError('please enter a valid email')
            isAllValueFilled = false;
        }
        else if((addBtn && !data.FirstAddress) && true){
            setError('please enter a address')
            isAllValueFilled = false;
        }
        else if(data.Nok){
            if((addBtn && !data.NokName) && true){
                setError('please enter a Nok Name')
                isAllValueFilled = false;
            }
            else if((addBtn && !(data.NokPhoneNo && data.NokPhoneNo.toString().length==10)) || (data.NokPhoneNo && data.NokPhoneNo.toString().length!==10)){
                setError('please enter Nok mobile number')
                isAllValueFilled = false;
            }
            else{
                setError('')
                isAllValueFilled = true;
            }
        }
        else{
            setError('')
            isAllValueFilled = true;
        }
        return isAllValueFilled;
    }
 
    const handleSubmit = async (btnVal:string) =>{
        
        var submitAuthetication = validation(btnVal);
        console.log('submitAuthetication',submitAuthetication);
        
        let newJson={
            ProviderName:data.Name,
            PhoneNo:data.PhoneNo,
            ContactAdd:data.FirstAddress,
            SecondaryAdd:data.SecondAddress,
            NokName:data.NokName,
            NokPhoneNo:data.NokPhoneNo,
            Email:data.Email,
            Status:btnVal==='Add' ? 'Pending':'Draft'
        }
        if(submitAuthetication){
            await sp.web.lists.getByTitle('ProviderList').items.add(newJson)
            .then((data)=>{
                props.setChange({...props.change,provider:false})
            })
            .catch(error=>console.log('add error',error))
            
        }
    }

    return(
        <div className={styles.formContainer}>
            <div className={styles.inputAlign}>
                <div>
                    <TextField value={data.Name} placeholder='Provider Name' styles={text} name='Provider Name' onChange={(event)=>handleInputValue(event)} underlined disabled={false}/>
                </div>
                <div>
                    <TextField value={data.PhoneNo ? data.PhoneNo.toString():''} styles={text} placeholder='Phone No' name='Phone No' type='number' maxLength={10} onChange={(event)=>handleInputValue(event)} underlined disabled={false}/>
                </div>
            </div>
            <div>
                <TextField value={data.Email} placeholder='Email' name='Email' styles={text} onChange={(event)=>handleInputValue(event)} underlined disabled={false}/>
            </div>
            <div className={styles.inputAlign}>
                <div>
                    <TextField value={data.FirstAddress} placeholder='Contact Address' name='Contact Address' multiline rows={3} onChange={(event)=>handleInputValue(event)} underlined disabled={false}/>
                </div>
                <div>
                    <TextField value={data.SecondAddress} placeholder='Second Address' name='Second Address' multiline rows={3} onChange={(event)=>handleInputValue(event)} underlined disabled={false}/>
                </div>
            </div>
            <div>
                <Checkbox checked={data.Nok} label='Nok' name='Nok' onChange={(event)=>handleInputValue(event)} disabled={false}/>
            </div>
            {
                data.Nok ? 
                (<div className={styles.inputAlign}>
                    <div>
                        <TextField value={data.NokName} placeholder='Nok Name'styles={text} name='Nok Name' onChange={(event)=>handleInputValue(event)} underlined disabled={false}/>
                    </div>
                    <div>
                        <TextField value={data.NokPhoneNo ? data.NokPhoneNo.toString():''} styles={text} placeholder='Nok Phone No' name='Nok Phone No' type='number' onChange={(event)=>handleInputValue(event)} underlined disabled={false}/>
                    </div>
                </div>
                )
                :
                null
            }
            <div>
                <p style={{textAlign:'center',color:'red'}}>{error}</p>
                <div className={styles.formBtn}>
                    <DefaultButton text='Add' onClick={()=>handleSubmit('Add')}/>
                    <DefaultButton text='Draft' onClick={()=>handleSubmit('Draft')}/>
                </div>
            </div>
        </div>
    )
}

export default ProviderAddForm;