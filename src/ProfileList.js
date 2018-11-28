import React, { Component } from 'react';
import logo from './logo.svg';
import { graphql, compose, Query } from 'react-apollo'

import TimeElapsed from './TimeElapsed'
import TimeElapsedString from './TimeElapsedString'
import ProfileChart from './ProfileChart'
import Nav from './Nav'

import {ALL_PROFILES} from './profile'

class ProfileList extends Component {
  constructor(props) {
    super(props)

    this.state = {
      profile: {
        testBeganAt: 'N/A',
        oscillations: []},
      patient: {
        name:'Unnamed Patient'
      }
    }
  }

  render() {
    let _this = this

    return (
      <div class="profiles-list">
        <h1>Profiles</h1>

          <div class="list-group">
            <div class="list-group-item list-group-item-secondary">
              <div class="row ">
                <div class="col-sm-2 font-weight-bold">Patient Name</div>
                <div class="col-sm-2">Began At</div>
                <div class="col-sm-2">Oscillations</div>
                <div class="col-sm-4 source-col">Source</div>
                <div class="col-sm-2">
                  <span className={"badge badge-pill badge-primary"}>Test Status</span>
                </div>
              </div>
            </div>

            <Query query={ALL_PROFILES} pollInterval={5000}>
              {({ loading, error, data }) => {
                if (loading) return (<div class="spinner-overlay">
                    <div class="spinner center">
                      <div class="spinner-blade"></div>
                      <div class="spinner-blade"></div>
                      <div class="spinner-blade"></div>
                      <div class="spinner-blade"></div>
                      <div class="spinner-blade"></div>
                      <div class="spinner-blade"></div>
                      <div class="spinner-blade"></div>
                      <div class="spinner-blade"></div>
                      <div class="spinner-blade"></div>
                      <div class="spinner-blade"></div>
                      <div class="spinner-blade"></div>
                      <div class="spinner-blade"></div>
                    </div>
                  </div>);
                if (error) return <div>`Error! ${error.message}`</div>;
                return (
                    data.allProfiles.map(profile => {

                      let patient = profile.patient

                      let statusText = (profile.status < 2) ? "In Progress" : "Completed"
                      let statusClass = (profile.status < 2) ? "badge-info" : "badge-success"

                      let patientName = (patient == null) ? "Unnamed Patient" : patient.name
                      let testBeganAt = profile.testBeganAt == null ? "Waiting..." : new Date(Date.parse(profile.testBeganAt)).toLocaleString()
                      let source = profile.videoName == null ? "Back-Facing Camera" : profile.videoName

                      let Tr = profile.rOscillation == null ? "..." : TimeElapsedString(profile.rOscillation.maxDate)
                      let Tk = profile.kOscillation == null ? "..." : TimeElapsedString(profile.kOscillation.maxDate - profile.rOscillation.maxDate)
                      let alpha = profile.alphaAngle == null ? "..." : profile.alphaAngle.toFixed(3) + 'º'
                      let ma = profile.maOscillation == null ? "..." : profile.maOscillation.coagulationIndex.toFixed(3) + ' mm'
                      let ly30ratio = profile.ly30Ratio == null ? "..." : (profile.ly30Ratio * 100).toFixed(3) + '%'


                      return (
                        <a href={"/profile/"+profile.id+(window.location.pathname.includes('api') ? '/api' : '')} class="list-group-item list-group-item-action">
                          <div class="row" key={profile.id}>
                            <div class="col-sm-2"><strong>{patientName}</strong></div>
                            <div class="col-sm-2">{testBeganAt}</div>
                            <div class="col-sm-2">{profile.oscillations.length} Oscillations</div>
                            <div class="col-sm-4 source-col">{source}</div>
                            <div class="col-sm-2">
                              <span className={"badge badge-pill " + statusClass}>
                                {statusText}
                              </span>
                            </div>

                          </div>
                        </a>
                      )
                    })
                  )
              }}
            </Query>
            </div>
      </div>

    );
  }

}

//https://github.com/alibaba/BizCharts/blob/master/doc_en/api/axis.md
export default ProfileList
