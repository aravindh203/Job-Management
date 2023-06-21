import * as React from 'react';
import DashBoardComponent from './DashBoardComponent';
import ProviderForm from './Provider/providerFrom';
const MainCoimponent=(props:any)=>{
    const [componentChange,setComponentChange]=React.useState({
        provider:false,
        clinet:false,
        contructor:false
    })
    
    return(
        <>
            {!componentChange.provider && !componentChange.clinet && !componentChange.contructor ?
                <DashBoardComponent change={componentChange} setChange={setComponentChange}/>
                :
                null
            }  

            {
                componentChange.provider ? <ProviderForm change={componentChange} setChange={setComponentChange}/>:null
            }      
        </>
     )
}
export default MainCoimponent