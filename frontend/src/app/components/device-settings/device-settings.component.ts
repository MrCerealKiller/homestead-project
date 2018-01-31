import { Component, OnInit } from '@angular/core';
import { NgForOf } from '@angular/common';
import { Router } from '@angular/router';

import { User } from '../../interfaces/user';
import { Device } from '../../interfaces/device';

import { FlashMessagesService } from 'angular2-flash-messages';
import { ValidateService } from '../../services/validate.service';
import { AuthorizeService } from '../../services/authorize.service';
import { DevicePipeService } from '../../services/device-pipe.service';

@Component({
  selector: 'app-device-settings',
  templateUrl: './device-settings.component.html',
  styleUrls: ['./device-settings.component.css']
})

export class DeviceSettingsComponent implements OnInit {
  headers: any;
  panels: any;

  user: User;

  devices: Device[];

  // Add Device
  addCustomId: String;
  addAssignedService: String;
  addIpAddress: String;

  // Update Device
  selectedUpdateDevice: Device;
  updateCustomId: String;
  updateAssignedService: String;
  updateIpAddress: String;

  // Delete Device
  selectedDeleteDevice: Device;

  constructor(private m_fmService: FlashMessagesService,
              private m_authService: AuthorizeService,
              private m_validateService: ValidateService,
              private m_devicePipeService: DevicePipeService,
              private m_router: Router) { }

  ngOnInit() {
    this.updateLists();
  }

  ngAfterViewInit() {
    this.headers = document.getElementsByClassName('collapse-header')
    this.panels = document.getElementsByClassName('collapse-panel');
  }

  updateLists() {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.m_devicePipeService.getUserDevices(this.user, null).subscribe(data => {
      if (data.success) {
        this.devices = data.devices;
      } else {
        this.m_fmService.show(data.msg, {cssClass: 'alert-danger', timeout: 6000});
      }
    });
  }

  expand(target) {
    for(var i = 0; i < 3; i++) {
      var header = this.headers[i];
      var panel = this.panels[i];

      if(i == target && !header.classList.contains('active-header')) {
        header.classList.add('active-header');
        panel.style.maxHeight = panel.scrollHeight + "px";
      } else {
        header.classList.remove('active-header');
        panel.style.maxHeight = "0";
      }
    }
  }

  onAddSubmit() {
    var device : Device = {
      customId: this.addCustomId,
      user: this.user.username,
      deviceService: this.addAssignedService,
      lastIpAddress: this.addIpAddress,
      lastStatusUpdate: 'New Device'
    };

    var validateResult = this.m_validateService.validateDevice(device);

    if (validateResult.isErr) {
      //console.log(validateResult.msg);
      this.m_fmService.show(validateResult.msg, {cssClass: 'alert-danger', timeout: 6000});
      return false;
    }

    // Save New Device to Backend
    this.m_devicePipeService.addDevice(device).subscribe(data => {
      if (data.success) {
        this.m_fmService.show("Your device has been added.", {cssClass: 'alert-normal', timeout: 5000});
        this.addCustomId = null;
        this.addAssignedService = null;
        this.addIpAddress = null;
        this.updateLists();
      } else {
        this.m_fmService.show(data.msg, {cssClass: 'alert-danger', timeout: 6000});
      }
    });
  }

  prefillUpdateForm() {
    if (this.selectedUpdateDevice != null && this.selectedUpdateDevice != undefined) {
      this.updateCustomId = this.selectedUpdateDevice.customId;
      this.updateAssignedService = this.selectedUpdateDevice.deviceService;
      this.updateIpAddress = this.selectedUpdateDevice.lastIpAddress;
    }
  }

  onUpdateSubmit() {
    var update : Device = {
      _id: this.selectedUpdateDevice._id,
      customId: this.updateCustomId,
      user: this.user.username,
      deviceService: this.updateAssignedService,
      lastIpAddress: this.updateIpAddress,
      lastStatusUpdate: 'Renewing Connection'
    };

    var validateResult = this.m_validateService.validateDevice(update);

    if (validateResult.isErr) {
      //console.log(validateResult.msg);
      this.m_fmService.show(validateResult.msg, {cssClass: 'alert-danger', timeout: 6000});
      return false;
    }

    // Save Update to Backend
    this.m_devicePipeService.updateDevice(update).subscribe(data => {
      if (data.success) {
        this.m_fmService.show("Your device has been updated.", {cssClass: 'alert-normal', timeout: 5000});
        this.updateCustomId = null;
        this.updateAssignedService = null;
        this.updateIpAddress = null;
        this.updateLists();
      } else {
        this.m_fmService.show(data.msg, {cssClass: 'alert-danger', timeout: 6000});
      }
    });
  }

  onDeleteSubmit() {
    // Show Modal Window
    document.getElementById('deleteModal').style.display = "block";
  }

  onCancelDeleteSubmit() {
    // Close Modal Window
    document.getElementById('deleteModal').style.display = "none";
  }

  onConfirmDeleteSubmit() {
    var id = this.selectedDeleteDevice._id;

    this.m_devicePipeService.deleteDevice(id).subscribe(data => {
      if (data.success) {
        this.m_fmService.show("Your device has been deleted.", {cssClass: 'alert-normal', timeout: 5000});
        document.getElementById('deleteModal').style.display = "none";
        this.updateLists();
      } else {
        this.m_fmService.show(data.msg, {cssClass: 'alert-danger', timeout: 6000});
      }
    });
  }
}
