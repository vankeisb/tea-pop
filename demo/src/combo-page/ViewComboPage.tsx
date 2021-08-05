import * as React from 'react';
import {Dispatcher, map} from "tea-cup-core";
import { ComboPage } from './ComboPage';
import { comboBoxMsg, ComboPageMsg } from './ComboPageMsg';
import { ComboBoxRenderer, ComboBoxRenderItemProps, ViewComboBox } from 'tea-pop-combobox';

class MyComboRenderer implements ComboBoxRenderer<string> {
    renderItem(props: ComboBoxRenderItemProps<string>): React.ReactElement {
        return (
            <div className="my-item">
                {props.item}
            </div>
        )
    }

    renderLoading(): React.ReactElement {
        return <div>Loading...</div>
    }

    renderNoMatches(): React.ReactElement {
        return <div>No matches !</div>
    }

}

export function viewComboPage(dispatch: Dispatcher<ComboPageMsg>, page: ComboPage) {
    return (
        <div className="combo-page">
            <h1>ComboBox sample</h1>
            <ViewComboBox 
                dispatch={map(dispatch, comboBoxMsg)} 
                model={page.comboModel}
                renderer={new MyComboRenderer()}
            />
        </div>
    )
}