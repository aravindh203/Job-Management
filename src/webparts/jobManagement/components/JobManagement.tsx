import * as React from 'react';
import styles from './JobManagement.module.scss';
import { IJobManagementProps } from './IJobManagementProps';
import { escape } from '@microsoft/sp-lodash-subset';
import MainCoimponent from './MainComponent';
import {sp} from "@pnp/sp/presets/all";
import './../css/index.css'
export default class JobManagement extends React.Component<IJobManagementProps, {}> {
  public constructor(prop:IJobManagementProps, state:{}){
    super(prop);
    sp.setup({
      spfxContext:this.props.context,
    });
  }
  public render(): React.ReactElement<IJobManagementProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName,
    } = this.props;

    return (
      <div>
        <MainCoimponent context={this.props.context}/>
      </div>
    );
  }
}
