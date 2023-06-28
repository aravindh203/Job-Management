import * as React from 'react';
import { useState,useEffect } from 'react';
import { TextField } from '@fluentui/react/lib/TextField';
import { Checkbox, DefaultButton, Dropdown, IconButton, values } from '@fluentui/react';
import {sp} from "@pnp/sp/presets/all";
import styles from './../Provider/providerForm.module.scss';

interface IProviderAdd{
    Name:string;
    PhoneNo:string;
    Email:string;
    FirstAddress:string;
    SecondAddress:string;
    NokName:string;
    NokPhoneNo:number;
    status:string;
    files:any,
    updateFiles:any,
    deleteFiles:any
}

const ContructorEditForm = (props:any):JSX.Element =>{

    const isViewAuthentication = props.formView.status === 'view' ? true:false
    const isInputView = props.admin && !isViewAuthentication 

    const text={
        root:{
            ".ms-TextField-fieldGroup":{
                border:'none'
            }
        }
    }
    const options = [
        { key: 'Draft', text: 'Draft' },
        { key: 'Add', text: 'Add' },
    ]

    const [error,setError] = useState<string>('')
    const [phoneNum,setPhoneNum]=useState([])    
    const [folderName,setFolderName] =useState<string>('')
    const [data,setData] = useState<IProviderAdd>({
        Name:'',
        PhoneNo:"",
        Email:'',
        FirstAddress:'',
        SecondAddress:'',
        status:'',
        NokName:'',
        NokPhoneNo:null,
        files:[],
        updateFiles:[],
        deleteFiles:[]
    })  
    
    console.log('data',data);
    
    const [btnAuthntication,setBtnAuthendication] = useState({
        isAddBtn:false,
        isDraftBtn:false,
        isUpdateBtn:false,
        isSubmitBtn:false,
        isApprove:false,
        isRejected:false
    })    
    
    const handleError = (type:string,error:any):void =>{
        console.log(error)
    }

    const handleInputValue = (key:string,value:any):void =>{
        let Data={...data}
        Data[key]=value
        setData(Data)
        // if(event.target.name==='Contructor Name'){
        //     setData({...data,Name:event.target.value})
        // }
        // else if(event.target.name==='Phone No' ){
        //     setData({...data,PhoneNo:event.target.value})
        // }
        // else if(event.target.name==='Email'){
        //     setData({...data,Email:event.target.value})
        // }
        // else if(event.target.name==='Contact Address'){ 
        //     setData({...data,FirstAddress:event.target.value})
        // }
        // else if(event.target.name==='Second Address'){
        //     setData({...data,SecondAddress:event.target.value})
        // }
        // else if(event.target.name==='Nok Name'){
        //     setData({...data,NokName:event.target.value})
        // }
        // else{
        //     setData({...data,NokPhoneNo:event.target.value})
        // }
        
    }

    const getPhoneNumber=async(number:string)=>{
        await sp.web.lists.getByTitle(props.list.listName).items.select("PhoneNo").get().then((item)=>{
            
           let phoneNum=[];
           item.forEach((value)=>{
                let mobileNumber = value.PhoneNo ? value.PhoneNo:''
               
                phoneNum.push(mobileNumber)
           })

           let index = [...phoneNum].findIndex(value=>value===number);
           phoneNum.splice(index,1)
           setPhoneNum([...phoneNum])
        }).catch((error)=>handleError("getPhonoNo",error))
    }

    const validation = (type):boolean =>{

        let isAllValueFilled=true;
        let emailvalidation=/^([A-Za-z0-9_.])+\@([g][m][a][i][l])+\.([c][o][m])+$/;
        let isDraft = (type === 'Draft' || type === 'Rejected') ? true:false;
        let phoneNoValidation=[...phoneNum].every(value=>{            
            return value !== data.PhoneNo
        }) 
        console.log('edit isDraft ',isDraft);
        
        console.log('edit phoneNoValidation',phoneNoValidation);
        

        if(!data.Name){
            setError('please fill name')
            isAllValueFilled = false;
        }
        else if((!isDraft && !data.PhoneNo)){
            setError('please enter a valid phone number')
            isAllValueFilled = false;
        }
        else if((!isDraft && data.PhoneNo && !phoneNoValidation) || (isDraft && data && !phoneNoValidation)){
            setError('phone number  already exists')
            isAllValueFilled = false;
        }
        else if((!isDraft && !(data.Email && emailvalidation.test(data.Email))) || (data.Email && !emailvalidation.test(data.Email))){
            setError('please enter a valid email')
            isAllValueFilled = false;
        }
        else if(!isDraft && !data.FirstAddress){
            setError('please enter a address')
            isAllValueFilled = false;
        }
        else if(!isDraft && !data.NokName){
            setError('please enter a Nok Name')
            isAllValueFilled = false;
        }
        else if(!isDraft && !data.NokPhoneNo){
            setError('please enter Nok mobile number')
            isAllValueFilled = false;
        }
        else{
            setError('')
            isAllValueFilled = true;
        }
        return isAllValueFilled;
    }
 
    const handleUpdate = async (type:string) =>{
        var updateAuthetication = validation(type);
        
        let newJson={
            ContrctName:data.Name, 
            PhoneNo:data.PhoneNo ? data.PhoneNo:null,
            ContactAddress:data.FirstAddress,
            SecondAddress:data.SecondAddress,
            NokName:data.NokName,
            NokPhoneNo:data.NokPhoneNo,
            Email:data.Email,
            Status:type
        }
        if(updateAuthetication){
            props.setChange({...props.change,conturctorEdit:false,isSpinner:true})
            await sp.web.lists.getByTitle(props.list.listName).items.getById(props.formView.Id).update(newJson)
            .then( async (result)=>{
                
                await sp.web.rootFolder.folders.getByName(props.list.libraryName).folders.filter('Name eq ' + "'" + folderName + "'").get()
                .then(async (results)=>{
                    
                    for(let i=0;i<data.deleteFiles.length;i++){
                        await sp.web.getFileByServerRelativePath(data.deleteFiles[i].ServerRelativeUrl).delete()
                        .then(res=>console.log('del response',res))
                        .catch(error=>handleError('attachement delete',error))
                    }

                    for(let j=0;j<data.updateFiles.length;j++){
                        await sp.web.getFolderByServerRelativePath(results[0].ServerRelativeUrl)
                        .files.addUsingPath(data.updateFiles[j].name,data.updateFiles[j], { Overwrite: true })
                        .then(result=>console.log('data updated succesfully'))
                        .catch(error=>handleError('attachment update',error))
                    }
                })
                .catch(error=>handleError('get attachment folder',error))
                props.setChange({...props.change,conturctorEdit:false,isSpinner:false})
            })
            .catch(error=>{
                handleError('Client update',error)
                props.setChange({...props.change,conturctorEdit:true,isSpinner:false})
            })
        }
    }

    const handleBtnAuthendication = (result) =>{
        
        if(!isViewAuthentication){
            if(result.Status==='Draft'){
                setBtnAuthendication({...btnAuthntication,isAddBtn:true,isDraftBtn:true})
            }
            else if(result.Status==='Rejected'){
                setBtnAuthendication({...btnAuthntication,isSubmitBtn:true})
            }
            else if(result.Status==='Pending' || result.Status==='Re Submitted'){
                setBtnAuthendication({...btnAuthntication,isApprove:true,isRejected:true})
            }
        }
        else{
            setBtnAuthendication({
                isAddBtn:false,
                isDraftBtn:false,
                isUpdateBtn:false,
                isSubmitBtn:false,
                isApprove:false,
                isRejected:false
            })
        }
    }

    const getData = async () =>{
        await sp.web.lists.getByTitle(props.list.listName).items.select('id,ContrctName,PhoneNo,ContactAddress,SecondAddress,NokName,NokPhoneNo,Email,Status').getById(props.formView.Id).get()
        .then(async (data)=>{
            handleBtnAuthendication(data)
            if(data){
                await sp.web.rootFolder.folders.getByName(props.list.libraryName).folders.select('*,Id').filter('Name eq ' + "'" + data.Id + "'").get()
                .then( async (result)=>{ 
                                       
                         setFolderName(result[0].Name)
                         await sp.web.getFolderByServerRelativePath(result[0].ServerRelativeUrl).files.get()
                         .then((result)=>{                             
                            setData({
                               Name:data.ContrctName ? data.ContrctName:'',
                               PhoneNo:data.PhoneNo ? data.PhoneNo:null,
                               Email:data.Email ? data.Email:'',
                               FirstAddress:data.ContactAddress ? data.ContactAddress:'',
                               SecondAddress:data.SecondAddress ? data.SecondAddress:'',
                               status:data.Status ? data.Status:'',
                               NokName:data.NokName ? data.NokName:'',
                               NokPhoneNo:data.NokPhoneNo ? data.NokPhoneNo:null,
                               files:result.length ? result:[],
                               updateFiles:[],
                               deleteFiles:[]
                            })

                            let cutrrentNumber = data.PhoneNo ? data.PhoneNo:'' 
                            getPhoneNumber(cutrrentNumber)
                         })
                         .catch((error)=>handleError('get attachement',error))
                     }).catch((error)=>{handleError('edit get ',error);})
            }
        })
        .catch(error=>handleError('Contructor edit get',error))
    }

    const handleFileClose = (value,index) =>{
        var currentFiles = [...data.files]
        currentFiles.splice(index,1);

        var delFiles = [...data.deleteFiles,value];

        setData({...data,files:currentFiles,deleteFiles:delFiles})

    }

    const handleUpdateFileClose = (value:any,index:number) =>{
        var newUpdateFiles = [...data.updateFiles];
        newUpdateFiles.splice(index,1)

        setData({...data,updateFiles:newUpdateFiles})
    }

    const handleUpdateFile = (event:any) =>{

        var updatedfiles=[]
        for(let i=0;i<event.target.files.length;i++){

            let existAuthendication = [...data.files].some(value=>{value.Name===event.target.files[i].name})
            
            if(!existAuthendication){
                updatedfiles.push(event.target.files[i])
            }
        }

       setData({...data,updateFiles:updatedfiles})
     
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
                    <h3>Client {isViewAuthentication ? 'View':'Edit'} Form</h3>
                    <IconButton iconProps={{ iconName: 'Cancel' }} title="Cancel" ariaLabel="Cancel" className={styles.cancelButton} onClick={()=>{props.setChange({...props.change,conturctorEdit:false})}}/>
                </div>
                <div className={styles.formContent}>
                    <div className={styles.inputAlign}>
                        <div>
                            <TextField value={data.Name} label='Contructor Name' styles={text} name='Contructor Name' onChange={(event,text)=>handleInputValue("Name",text)} disabled={isViewAuthentication}/>
                        </div>
                        <div>
                            <TextField value={data.PhoneNo} styles={text} label='Phone No' name='Phone No'  maxLength={10} onChange={(event,text)=>handleInputValue("PhoneNo",text)} disabled={isViewAuthentication}/>
                        </div>
                    </div>
                    <div>
                        <TextField value={data.Email} label='Email' name='Email' styles={text} onChange={(event,text)=>handleInputValue("Email",text)} disabled={isViewAuthentication}/>
                    </div>
                    <div className={styles.inputAlign}>
                        <div>
                            <TextField value={data.FirstAddress} label='Contact Address' styles={text} name='Contact Address' multiline rows={3} onChange={(event,text)=>handleInputValue("FirstAddress",text)} disabled={isViewAuthentication}/>
                        </div>
                        <div>
                            <TextField value={data.SecondAddress} label='Second Address' styles={text} name='Second Address' multiline rows={3} onChange={(event,text)=>handleInputValue("SecondAddress",text)} disabled={isViewAuthentication}/>
                        </div>
                    </div>
                    <div className={styles.inputAlign}>
                        <div>
                            <TextField value={data.NokName} label='Nok Name'styles={text} name='Nok Name' onChange={(event,text)=>handleInputValue("NokName",text)} disabled={isViewAuthentication}/>
                        </div>
                        <div>
                            <TextField value={data.NokPhoneNo ? data.NokPhoneNo.toString():''} styles={text} label='Nok Phone No' name='Nok Phone No' type='number' onChange={(event,text)=>handleInputValue("NokPhoneNo",text)} disabled={isViewAuthentication}/>
                        </div>
                    </div>

                        {isViewAuthentication && <TextField value={data.status} styles={text} label='Status' disabled={isViewAuthentication}/>}
                    <div>
                        {
                            data.files.length ? 
                            (
                                data.files.map((value:any,index:number)=>{
                                    return (
                                        <div key={index}>
                                            <a href={value.ServerRelativeUrl+'? web=1'}>{value.Name}</a>
                                            {props.admin  && !isViewAuthentication &&  <IconButton iconProps={{ iconName: 'Cancel' }} onClick={()=>handleFileClose(value,index)}/>}
                                        </div>
                                    )
                                })
                            )
                            :
                            (
                                isViewAuthentication &&
                                <TextField value={'no attachement added'} styles={text} label='Attachments' disabled={isViewAuthentication}/>
                            )
                        }
                    </div>
                    {isInputView && <input name='file' type='file' onChange={(event)=>handleUpdateFile(event)} multiple />}
                    <div>
                        {  
                            data.updateFiles.length ? 
                                (
                                    data.updateFiles.map((value:any,index:number)=>{
                                        return (
                                            <div key={index}>
                                                <a href='#'>{value.name}</a>
                                                {props.admin && <IconButton iconProps={{ iconName: 'Cancel' }} onClick={()=>handleUpdateFileClose(value,index)}/>    }
                                            </div>
                                        )
                                    })
                                )
                                :
                                null
                        }
                    </div>
                    <div>
                        <p style={{textAlign:'center',color:'red'}}>{error}</p>
                        <div className={styles.formBtn}>
                            {btnAuthntication.isApprove && <DefaultButton text='Approve' onClick={()=>handleUpdate('Approve')}/>}
                            {btnAuthntication.isRejected && <DefaultButton text='Rejected' onClick={()=>handleUpdate('Rejected')}/>}
                            {btnAuthntication.isSubmitBtn && <DefaultButton text='ReSubmit' onClick={()=>handleUpdate('Re Submitted')}/>}
                            {btnAuthntication.isAddBtn && <DefaultButton text='Submit' onClick={()=>handleUpdate('Pending')}/>}
                            {btnAuthntication.isDraftBtn && <DefaultButton text='Draft' onClick={()=>handleUpdate('Draft')}/>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ContructorEditForm;