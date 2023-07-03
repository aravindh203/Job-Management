import { IconButton } from '@fluentui/react';
import * as React from 'react';
import styles from './AddForm.module.scss'
const errorComponent=()=>{
    return(
        <div className={styles.errorMsg}>
            <IconButton iconProps={{ iconName: 'Error' }} title="Error" ariaLabel="Error" />
            <h2>Oops !</h2>
            <h1>Something went wrong</h1>
        </div>
    )
}
export default errorComponent