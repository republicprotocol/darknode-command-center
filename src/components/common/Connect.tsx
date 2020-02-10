import * as React from "react";

import { connect } from "react-redux"; // Custom typings

import { ApplicationState } from "../../store/applicationState";
import { MapContainer } from "../overviewPage/mapContainer";
import { RenVMContainer } from "../renvmPage/renvmContainer";

class ConnectClass extends React.Component<Props> {
    public render = (): JSX.Element => {
        const { store: { renNetwork } } = this.props;

        return <MapContainer.Provider initialState={renNetwork}>
            <RenVMContainer.Provider initialState={renNetwork}>
                {this.props.children}
            </RenVMContainer.Provider>
        </MapContainer.Provider>;
    }
}

const mapStateToProps = (state: ApplicationState) => ({
    store: {
        renNetwork: state.account.renNetwork,
    },
});

interface Props extends ReturnType<typeof mapStateToProps> {
}

export const Connect = connect(mapStateToProps)(ConnectClass);
