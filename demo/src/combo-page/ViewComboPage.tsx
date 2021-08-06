import * as React from 'react';
import {Dispatcher, map} from "tea-cup-core";
import {ComboPage} from './ComboPage';
import {comboBoxMsg, ComboPageMsg} from './ComboPageMsg';
import {ComboBoxRenderer, ComboBoxRenderItemProps, ViewComboBox} from 'tea-pop-combobox';
import {ComboBoxRenderInputProps} from "../../../combobox/src";

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

    renderInput(props: ComboBoxRenderInputProps<string>): React.ReactElement {
        return (
            <div className={"my-cb-input"}>
                <input
                    id={props.id}
                    value={props.value}
                    onChange={(e) => {
                        const value = e.target.value;
                        props.onChange(value);
                    }}
                    onBlur={() =>
                        props.onBlur()
                    }
                    onKeyDown={(e) =>
                        props.onKeyDown(e.key)
                    }
                />
                <button
                    onClick={() =>
                        props.onTriggerClick()
                    }
                >
                  ⌄
                </button>
            </div>
        )
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
