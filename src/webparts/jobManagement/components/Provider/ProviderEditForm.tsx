import * as React from 'react';
import { useState,useEffect } from 'react';
import { TextField } from '@fluentui/react/lib/TextField';
import { Checkbox, DefaultButton, IconButton } from '@fluentui/react';
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

const ProviderEditForm = (props:any):JSX.Element =>{
    const text={
        root:{
            ".ms-TextField-fieldGroup":{
                border:'none'
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
 
    const handleUpdate = async (btnVal:string) =>{
        
        var updateAuthetication = validation(btnVal);
        console.log('updateAuthetication',updateAuthetication);
        
        let newJson={
            ProviderName:data.Name,
            PhoneNo:data.PhoneNo,
            ContactAdd:data.FirstAddress,
            SecondaryAdd:data.SecondAddress,
            NokName:data.NokName,
            NokPhoneNo:data.NokPhoneNo,
            Email:data.Email,
        }
        if(updateAuthetication){
            await sp.web.lists.getByTitle('ProviderList').items.getById(props.formView.Id).update(newJson)
            .then((data)=>{
                props.setChange({...props.change,ProviderEdit:false})
            })
            .catch(error=>console.log('add error',error))
            
        }
    }

    const getData = async () =>{
        await sp.web.lists.getByTitle("ProviderList").items.select('id,ProviderName,PhoneNo,ContactAdd,SecondaryAdd,NokName,NokPhoneNo,Email,Status').getById(props.formView.Id).get()
        .then(data=>{
            if(data){
                setData({
                    Name:data.ProviderName ? data.ProviderName:'',
                    PhoneNo:data.PhoneNo ? data.PhoneNo:null,
                    Email:data.Email ? data.Email:'',
                    FirstAddress:data.ContactAdd ? data.ContactAdd:'',
                    SecondAddress:data.SecondaryAdd ? data.SecondaryAdd:'',
                    Nok:false,
                    NokName:data.NokName ? data.NokName:'',
                    NokPhoneNo:data.NokPhoneNo ? data.NokPhoneNo:null,
                })
            }
        })
        .catch(error=>console.log('provider get',error))
    }

    useEffect(()=>{
        if(props.formView.authentication){
            getData();   
        }
    },[props.formView.authentication])

    return(
        <div className={styles.contain}>
            <div className={styles.formContainer}>
                <div className={styles.cancelBox}>
                    <IconButton iconProps={{ iconName: 'Cancel' }} title="Cancel" ariaLabel="Cancel" className={styles.cancelButton} onClick={()=>{props.setChange({...props.change,ProviderEdit:false})}}/>
                </div>
                <div className={styles.formContent}>
                    <div className={styles.inputAlign}>
                        <div>
                        <TextField value={data.Name} label='Provider Name' styles={text} name='Provider Name' onChange={(event)=>handleInputValue(event)} disabled={props.formView.status==='view' ? true:false}/>
                        </div>
                        <div>
                        <TextField value={data.PhoneNo ? data.PhoneNo.toString():''} styles={text} label='Phone No' name='Phone No' type='number' maxLength={10} onChange={(event)=>handleInputValue(event)} disabled={props.formView.status==='view' ? true:false}/>
                        </div>
                    </div>
                    <div>
                    <TextField value={data.Email} label='Email' name='Email' styles={text} onChange={(event)=>handleInputValue(event)} disabled={props.formView.status==='view' ? true:false}/>
                    </div>
                    <div className={styles.inputAlign}>
                        <div>
                        <TextField value={data.FirstAddress} label='Contact Address' styles={text} name='Contact Address' multiline rows={3} onChange={(event)=>handleInputValue(event)} disabled={props.formView.status==='view' ? true:false}/>
                        </div>
                        <div>
                            <TextField value={data.SecondAddress} label='Second Address' styles={text} name='Second Address' multiline rows={3} onChange={(event)=>handleInputValue(event)} disabled={props.formView.status==='view' ? true:false}/>
                        </div>
                    </div>
                    <div className={styles.inputAlign}>
                        <div>
                            <TextField value={data.NokName} label='Nok Name'styles={text} name='Nok Name' onChange={(event)=>handleInputValue(event)} disabled={props.formView.status==='view' ? true:false}/>
                        </div>
                        <div>
                            <TextField value={data.NokPhoneNo ? data.NokPhoneNo.toString():''} styles={text} label='Nok Phone No' name='Nok Phone No' type='number' onChange={(event)=>handleInputValue(event)} disabled={props.formView.status==='view' ? true:false}/>
                        </div>
                    </div>
                    <div>
                        <p style={{textAlign:'center',color:'red'}}>{error}</p>
                        <div className={styles.formBtn}>
                        {
                        props.formView.status!=='view' ?
                            <DefaultButton text='Update' onClick={()=>handleUpdate('Add')}/>
                        :
                            null
                        }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProviderEditForm;