import * as React from 'react';
import { useState,useEffect } from 'react';
import { TextField } from '@fluentui/react/lib/TextField';
import { Checkbox, DefaultButton, IconButton } from '@fluentui/react';
import {Files, sp} from "@pnp/sp/presets/all";
import styles from './providerForm.module.scss';

interface IProviderAdd{
    Name:string;
    PhoneNo:string;
    Email:string;
    FirstAddress:string;
    SecondAddress:string;
    Nok:boolean;
    NokName:string;
    NokPhoneNo:string;
    Files:any;
}

const ProviderAddForm = (props:any):JSX.Element =>{
    
    const text={
        root:{
            ".ms-TextField-fieldGroup":{
                border:'none'
            }
        }
    }

    const [error,setError] = useState<string>('')
    const [phoneNum,setPhoneNum]=useState([])    
    const [data,setData] = useState<IProviderAdd>({
        Name:'',
        PhoneNo:"",
        Email:'',
        FirstAddress:'',
        SecondAddress:'',
        Nok:false,
        NokName:'',
        NokPhoneNo:null,
        Files:[]
    })    
    
    const handleInputValue = (key:string,value:any):void =>{
        let Data={...data}
        Data[key]=value
        setData(Data)
       
    }

    const fileUpload=(datas)=>{

        let filesData=[];
        for(let i=0;i<datas.length;i++){
            filesData.push(datas[i])
        } 
        
        setData({...data,Files:filesData})

    }

    const handleFileClose=(index)=>{

        let deletedDoc=[...data.Files]
        deletedDoc.splice(index,1)

        setData({...data,Files:deletedDoc})

    }

    const getPhoneNovalidation=async()=>{

        await sp.web.lists.getByTitle(props.list.listName).items.select("PhoneNo").get().then((item)=>{
            
           let phoneNum=[];
           item.forEach((value)=>{
                let mobileNumber = value.PhoneNo ? value.PhoneNo:''
                phoneNum.push(mobileNumber)
           })

           setPhoneNum([...phoneNum])
        }).catch((error)=>errorFunction(error,"getPhonoNo"))

    }
    const validation = (btnVal:string):boolean =>{

        let isAllValueFilled=true;
        let emailvalidation=/^([A-Za-z0-9_.])+\@([g][m][a][i][l])+\.([c][o][m])+$/;
        let addBtn = btnVal === 'Add' ? true:false;
        let phoneNoValidation=[...phoneNum].every(value=>{            
            return value !== data.PhoneNo
        })

        if(!data.Name){
            setError('please fill name')
            isAllValueFilled = false;
        }
        else if(addBtn && !data.PhoneNo){
            setError('please enter a  phone number')
            isAllValueFilled = false;
        }
        else if((addBtn && data.PhoneNo && !phoneNoValidation) || (!addBtn && data.PhoneNo && !phoneNoValidation)){
            setError('phone number already exist')
            isAllValueFilled = false;
        }
        else if((addBtn && !(data.Email && emailvalidation.test(data.Email))) || (data.Email && !emailvalidation.test(data.Email))){
            setError('please enter a valid email')
            isAllValueFilled = false;
        }
        else if(addBtn && !data.FirstAddress){
            setError('please enter a address')
            isAllValueFilled = false;
        }
        else if(data.Nok){
            if(addBtn && !data.NokName){
                setError('please enter a Nok Name')
                isAllValueFilled = false;
            }
            else if(addBtn && !data.NokPhoneNo){
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
            
            props.setChange({...props.change,provider:false,isSpinner:true})
            
            await sp.web.lists.getByTitle(props.list.listName).items.add(newJson)
            .then((result)=>{                                
                createFolder(result.data.Id);
                props.setChange({...props.change,provider:false,isSpinner:false})
            })
            .catch(error=>{
                errorFunction('add error',error);
                props.setChange({...props.change,provider:true,isSpinner:false})
            })
        }
        
    }

    async function createFolder(ItemID){

        await sp.web.rootFolder.folders.getByName(props.list.libraryName).folders.addUsingPath(ItemID.toString(),true)
        .then(async (result)=> {
            for(let i=0;i<data.Files.length;i++){
                sp.web.getFolderByServerRelativePath(result.data.ServerRelativeUrl).files.addUsingPath(data.Files[i].name, data.Files[i], { Overwrite: true })
                .then(async (file) => {
                    await errorFunction('File created successfully:', file);
                })
                .catch(async (error) => {
                    await errorFunction('Error creating file:', error);
                });
            }
        })
        .catch(error => {
            errorFunction('Error creating folder:', error);
        });

    }

    const errorFunction=(name:string,error:any)=>{
        console.log(error,name);
    }

    useEffect(()=>{
        getPhoneNovalidation()
    },[])
    
    return(
        <div className={styles.contain}>
            <div className={styles.formContainer}>
                <div className={styles.cancelBox}>
                    <h3>Provider Add Form</h3>
                    <IconButton iconProps={{ iconName: 'Cancel' }} title="Cancel" ariaLabel="Cancel" className={styles.cancelButton} onClick={()=>{props.setChange({...props.change,provider:false})}}/>
                </div>
                <div className={styles.formContent}>
                    <div className={styles.inputAlign}>
                        <div>
                            <TextField value={data.Name} label='Provider Name' styles={text} name='Provider Name' onChange={(event,text)=>handleInputValue("Name",text)} disabled={false}/>
                        </div>
                        <div>
                            <TextField value={data.PhoneNo} styles={text} label='Phone No' name='Phone No' onChange={(event,text)=>handleInputValue("PhoneNo",text)} disabled={false}/>
                        </div>
                    </div>
                    <div>
                        <TextField value={data.Email} label='Email' name='Email' styles={text} onChange={(event,text)=>handleInputValue("Email",text)} disabled={false}/>
                    </div>
                    <div className={styles.inputAlign}>
                        <div>
                            <TextField value={data.FirstAddress} label='Contact Address' styles={text} name='Contact Address' multiline rows={3} onChange={(event,text)=>handleInputValue("FirstAddress",text)} disabled={false}/>
                        </div>
                        <div>
                            <TextField value={data.SecondAddress} label='Second Address' styles={text} name='Second Address' multiline rows={3} onChange={(event,text)=>handleInputValue("SecondAddress",text)} disabled={false}/>
                        </div>
                    </div>
                    <div>
                        <Checkbox checked={data.Nok} label='Nok' name='Nok' onChange={(event,text)=>handleInputValue("Nok",text)} disabled={false} />
                    </div>
                    {
                        data.Nok ? 
                        (<div className={styles.inputAlign}>
                            <div>
                                <TextField value={data.NokName} label='Nok Name'styles={text} name='Nok Name' onChange={(event,text)=>handleInputValue("NokName",text)} disabled={false}/>
                            </div>
                            <div>
                                <TextField value={data.NokPhoneNo ? data.NokPhoneNo.toString():''} styles={text} label='Nok Phone No' name='Nok Phone No' onChange={(event,text)=>handleInputValue("NokPhoneNo",text)} disabled={false}/>
                            </div>
                        </div>
                        )
                        :
                        null
                    }
                    <div>
                        {data.Files.length ? data.Files.map((value,index)=>{
                            return (
                                <div key={index}>
                                    <a href='#'>{value.name} </a>
                                    <IconButton iconProps={{ iconName: 'Cancel' }} onClick={()=>handleFileClose(index)}/> 
                                </div>
                            )
                        }):null}
                    </div>
                    <input className={styles.input} name='file' type='file' onChange={(event)=>{fileUpload(event.target.files)}} multiple />

                    <div>
                        <p style={{textAlign:'center',color:'red'}}>{error}</p>
                        <div className={styles.formBtn}>
                            <DefaultButton text='Submit' onClick={()=>handleSubmit('Add')}/>
                            <DefaultButton text='Draft' onClick={()=>handleSubmit('Draft')}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProviderAddForm;