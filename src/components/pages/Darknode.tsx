import * as qs from "query-string";
import * as React from "react";

import Web3 from "web3";

import { connect } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router";
import { bindActionCreators, Dispatch } from "redux";

import { StatusPage } from "../../components/statuspage/StatusPage";

import { RegistrationStatus, setDarknodeName } from "../../actions/statistics/operatorActions";
import { EncodedData, Encodings } from "../../lib/general/encodedData";
import { ApplicationData } from "../../reducers/types";
import { NotFound } from "./NotFound";

export enum DarknodeAction {
    View = "view",
    Register = "register",
    Deregister = "deregister",
}

interface DarknodeProps extends
    ReturnType<typeof mapStateToProps>,
    ReturnType<typeof mapDispatchToProps>,
    RouteComponentProps {
}

interface DarknodeState {
    darknodeID: string | undefined;
    action: string | undefined;
    publicKey: string | undefined;
    providedName: string | undefined;
}

/**
 * Darknode shows the details of a darknode. The user does not have to be logged
 * in.
 *
 * URL parameters:
 *     1) action: either "register" or "deregister"
 *     2) public_key: only used if action is "register"
 */
class DarknodeClass extends React.Component<DarknodeProps, DarknodeState> {
    public constructor(props: DarknodeProps, context: object) {
        super(props, context);
        this.state = {
            darknodeID: undefined,
            action: undefined,
            publicKey: undefined,
            providedName: undefined,
        };
    }

    public componentDidMount = () => {
        this.handleNewProps(this.props, true);
    }

    public componentWillReceiveProps = (nextProps: DarknodeProps) => {
        this.handleNewProps(nextProps, false);
    }

    public render(): JSX.Element {
        const { match: { params }, store } = this.props;
        const { darknodeDetails, darknodeNames, address } = store;

        const { darknodeID, action, publicKey, providedName } = this.state;

        const details = darknodeID ? darknodeDetails.get(darknodeID, null) : null;
        const name = darknodeID ? darknodeNames.get(darknodeID) : undefined;

        const readOnly = !details || !address || details.operator !== address;

        let darknodeAction = DarknodeAction.View;
        if (
            (action === DarknodeAction.Register) &&
            (!details || details.registrationStatus === RegistrationStatus.Unregistered)
        ) {
            // If the URL action is Register, and the darknode has no details or is unregistered
            darknodeAction = action;
        } else if ((action === DarknodeAction.Deregister) &&
            details &&
            details.registrationStatus === RegistrationStatus.Registered
        ) {
            // If the URL action is Deregister, and the darknode is registered
            darknodeAction = action;
        }

        if (!darknodeID) {
            return <NotFound />;
        }

        return (
            <div>
                {/* <Header /> */}
                <div className="container">
                    <StatusPage
                        key={darknodeID}
                        action={darknodeAction}
                        publicKey={publicKey}
                        name={name}
                        darknodeID={darknodeID}
                        isOperator={!readOnly}
                        darknodeDetails={details}
                    />
                </div>
            </div >
        );
    }

    private handleNewProps = (nextProps: DarknodeProps, firstTime: boolean) => {
        const { location: { search } } = this.props;
        const { match: { params: nextParams }, location: { search: nextSearch } } = nextProps;

        const darknodeID: string | undefined = getDarknodeParam(nextParams);
        this.setState({ darknodeID });

        if (firstTime || search !== nextSearch) {
            const queryParams = qs.parse(nextSearch);
            const action = typeof queryParams.action === "string" ? queryParams.action : undefined;
            const publicKey = typeof queryParams.public_key === "string" ? queryParams.public_key : undefined;
            const name = typeof queryParams.name === "string" ? queryParams.name : undefined;

            if (darknodeID && action === DarknodeAction.Register && name !== undefined) {
                this.props.actions.setDarknodeName({ darknodeID, name });
            }

            this.setState({ action, publicKey, providedName: name });
        }
    }

}

const mapStateToProps = (state: ApplicationData) => ({
    store: {
        address: state.trader.address,
        darknodeDetails: state.statistics.darknodeDetails,
        darknodeNames: state.statistics.darknodeNames,
    },
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    actions: bindActionCreators({
        setDarknodeName,
    }, dispatch),
});

export const Darknode = connect(mapStateToProps, mapDispatchToProps)(withRouter(DarknodeClass));

export const getDarknodeParam = (params: unknown): string | undefined => {
    const { darknodeID: darknodeID58 } = params as { darknodeID: string | undefined };
    let darknodeID;
    if (darknodeID58) {
        try {
            // Convert from base-58 to hex
            darknodeID = darknodeIDbase58ToHex(darknodeID58);
        } catch (err) {
            // If the darknode ID is malformatted, ignore it
            console.error(err);
            darknodeID = undefined;
        }
    }
    return darknodeID;
};

export const darknodeIDbase58ToHex = (darknodeID: string): string =>
    (new Web3()).utils.toChecksumAddress(
        ("0x" + new EncodedData(darknodeID, Encodings.BASE58).toHex("").slice(4)).toLowerCase()
    );

export const darknodeIDHexToBase58 = (darknodeID: string): string =>
    new EncodedData("0x1B14" + darknodeID.slice(2), Encodings.HEX).toBase58();
