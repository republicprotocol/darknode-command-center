import * as React from "react";

import RenExSDK from "@renex/renex";

import { faChevronRight, faStar, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import { ApplicationData, DarknodeDetails } from "@Reducers/types";
import { Block, BlockBody, BlockTitle } from "./Block";
import { FeesItem } from "./FeesItem";
import { Token, TokenDetails } from "./lib/tokens";
import { TokenBalance } from "./TokenBalance";

interface StoreProps {
}

interface FeesBlockProps extends StoreProps {
    sdk: RenExSDK;
    darknodeDetails: DarknodeDetails;

    actions: {
    };
}

interface FeesBlockState {
    showAdvanced: boolean;
}

class FeesBlockClass extends React.Component<FeesBlockProps, FeesBlockState> {

    public constructor(props: FeesBlockProps, context: object) {
        super(props, context);
        this.state = {
            showAdvanced: false,
        };
    }

    public render(): JSX.Element {
        const { sdk, darknodeDetails } = this.props;
        const { showAdvanced } = this.state;

        return (
            <Block className="fees-block">
                {showAdvanced ? <div className="block--basic--hide" onClick={this.toggleAdvanced}>
                    <FontAwesomeIcon icon={faTimes} pull="left" />
                </div> : null}

                <BlockTitle>
                    <h3>
                        <FontAwesomeIcon icon={faStar} pull="left" />
                        Darknode Income
                    </h3>
                </BlockTitle>

                <BlockBody>
                    {!showAdvanced ?
                        <div className="block--basic">
                            <div className="block--basic--top">
                                <span className="fees-block--basic--sign">$</span>
                                <span className="fees-block--basic--value">{0}</span>
                                <span className="fees-block--basic--unit">USD</span>
                            </div>
                            <div className="block--basic--show" onClick={this.toggleAdvanced}>
                                <FontAwesomeIcon icon={faChevronRight} pull="left" />
                            </div>
                        </div> :
                        <div className="block--advanced">
                            <div className="block--advanced--top">
                                <span className="fees-block--advanced--sign">$</span>
                                <span className="fees-block--advanced--value">{0}</span>
                                <span className="fees-block--advanced--unit">USD</span>
                            </div>

                            <div className="block--advanced--bottom scrollable">
                                <table className="fees-block--table">
                                    <tbody>
                                        {
                                            darknodeDetails.feesEarned.map((balance: string, token: Token) => {
                                                // tslint:disable-next-line:no-non-null-assertion
                                                const tokenDetails = TokenDetails.get(token)!;
                                                const image = require(`../../tokens/${tokenDetails.icon}`);

                                                return <tr key={token}>
                                                    <td><img className="fees-block--table--icon" src={image} /> <span>{tokenDetails.symbol}</span></td>
                                                    <td className="fees-block--table--value"><TokenBalance token={token} amount={balance} /></td>
                                                    <td className="fees-block--table--usd">$<TokenBalance token={token} amount={balance} /> <span className="fees-block--table--usd-symbol">USD</span></td>
                                                    <td><FeesItem key={token} web3={sdk.getWeb3()} token={token} amount={balance} darknodeAddress={darknodeDetails.ID} /></td>
                                                </tr>;
                                            }).valueSeq().toArray()
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    }

                </BlockBody>
            </Block>
        );
    }

    private toggleAdvanced = () => {
        this.setState({ showAdvanced: !this.state.showAdvanced });
    }

}

function mapStateToProps(state: ApplicationData): StoreProps {
    return {
    };
}

function mapDispatchToProps(dispatch: Dispatch): { actions: FeesBlockProps["actions"] } {
    return {
        actions: bindActionCreators({
        }, dispatch)
    };
}

export const FeesBlock = connect(mapStateToProps, mapDispatchToProps)(FeesBlockClass);
