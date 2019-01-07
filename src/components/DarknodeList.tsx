import * as React from "react";

import { List, Map } from "immutable";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { bindActionCreators } from "redux";

import { ApplicationData, DarknodeDetails } from "../reducers/types";
import { DarknodeCard } from "./DarknodeCard";
import { EmptyDarknodeCard } from "./EmptyDarknodeCard";
import { EmptyDarknodeList } from "./EmptyDarknodeList";
import { Loading } from "./Loading";

interface DarknodeListProps extends ReturnType<typeof mapStateToProps>, ReturnType<typeof mapDispatchToProps> {
    darknodeList: List<string> | null;
    darknodeDetails: Map<string, DarknodeDetails>;
    darknodeNames: Map<string, string>;
    darknodeRegisteringList: Map<string, string>;
}

class DarknodeListClass extends React.Component<DarknodeListProps> {
    public constructor(props: DarknodeListProps, context: object) {
        super(props, context);
    }

    public render(): JSX.Element {
        const { darknodeList, darknodeDetails, darknodeNames, darknodeRegisteringList } = this.props;

        return (
            <div className={`darknode-list ${darknodeList && darknodeList.size < 4 ? "darknode-list--empty" : ""}`}>
                {darknodeList === null ? <div className="darknode-list--loading"><Loading alt={true} /></div> : <>
                    {darknodeList && darknodeList.map((darknodeID) => {
                        const details = darknodeDetails.get(darknodeID) || null;
                        const name = darknodeNames.get(darknodeID);

                        return <DarknodeCard
                            key={darknodeID}
                            name={name}
                            darknodeID={darknodeID}
                            darknodeDetails={details}
                            publicKey={darknodeRegisteringList.get(darknodeID)}
                        />;
                    }).toArray()}
                    {darknodeList.size === 0 ? <EmptyDarknodeList /> : <>
                        {darknodeList.size < 2 ? <EmptyDarknodeCard className="second" /> : null}
                        {darknodeList.size < 3 ? <EmptyDarknodeCard className="third" /> : null}
                        {darknodeList.size < 4 ? <EmptyDarknodeCard className="fourth" /> : null}
                    </>}
                </>}
            </div>
        );
    }
}

const mapStateToProps = (state: ApplicationData) => ({
    store: {
    },
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    actions: bindActionCreators({
    }, dispatch),
});

export const DarknodeList = connect(mapStateToProps, mapDispatchToProps)(DarknodeListClass);