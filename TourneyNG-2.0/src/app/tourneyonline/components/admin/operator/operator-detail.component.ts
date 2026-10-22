import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserVO } from 'app/tourneyonline/domain/user-vo';
import { UserService } from 'app/tourneyonline/service/user-service';
import { Observable } from 'rxjs';
import { UserDetailView } from '../userng/user-detailview';
import { TourneyService } from 'app/tourneyonline/service/tourney-service';
import { LoginService } from 'app/tourneyonline/service/login-service';
import { RoleService } from 'app/tourneyonline/service/role-service';
import { ClientService } from 'app/tourneyonline/service/client-service';
import { UrcService } from 'app/tourneyonline/service/urc-service';
import { CountryService } from 'app/tourneyonline/service/country-service';
import { Location } from '@angular/common'
import { TableCols } from 'app/tourneyonline/domain/table-cols';
import { Team } from 'app/tourneyonline/domain/team';
import { TeamService } from 'app/tourneyonline/service/team-service';

@Component({
  selector: 'app-operator-detail',
  templateUrl: './operator-detail.component.html',
  standalone: false
})
export class OperatorDetailComponent extends UserDetailView  {
    private fb = inject(FormBuilder);

    selectedOperator: UserVO | null = new UserVO();
    searchQuery: any;
    filteredUsers: UserVO[] = [];

    operatorForm!: FormGroup;
    cols: TableCols[] = TeamService.cols;
    selectedTeams: Team[] = [];
    teams: Team[] = [];

  constructor(
        protected override tourneyService: TourneyService,
        protected override userService: UserService,
        protected override loginService: LoginService,
        protected override roleService: RoleService,
        protected override location: Location,
        protected override clientService: ClientService,
        public override    urcService: UrcService,
        protected override countryService: CountryService 
    ) {
        super( userService,
             location,
             tourneyService,
             countryService,
             urcService,
             roleService,
             loginService,
             clientService
            );
    }
    
    override ngOnInit() {
        this.initForm();
        super.ngOnInit();
        this.selectedTourney = this.tourneyService.selectedTourney;
        this.teams = this.selectedTourney.teams;
        for(let t of this.teams) {
            for(let o of t.operators) {
                if(this.selectedUser.username == o ) {
                    this.selectedTeams.push(t);
                }
            }
        }
    }

    private initForm() {
        this.operatorForm = this.fb.group({
        id: [null],
        firstname: ['', Validators.required],
        lastname: ['', Validators.required],
        username: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        phoneNumber: ['', Validators.required],
        address: ['', Validators.required],
        country: [null, Validators.required],
        description: ['']
        });
    }

    // Handle autocomplete user lookup
    onSearchUser(event: any) {
        const query : string = event.query;
        // Call backend service to fetch matching users by username
        const subscriber : Observable<UserVO>  = this.userService.getUserByUsername(query);
        subscriber.subscribe(cs => this.onVerifyForCreateNext(cs), e => this.onError(e) );
    }

    // Populate form when existing user is selected
    onUserSelected(user: any) {
        this.selectedUser = user;
        this.urcService.newUser = false;
        this.operatorForm.patchValue(user);
    }

    // Reset form to create a new user
    prepareNewUser() {
        this.selectedOperator = null;
        this.urcService.newUser = true;
        this.operatorForm.reset();
        
        // Auto-fill username if query was typed
        if (typeof this.searchQuery === 'string') {
        this.operatorForm.patchValue({ username: this.searchQuery });
        }
    }

    resetForm() {
        this.selectedOperator = null;
        this.searchQuery = null;
        this.urcService.newUser = false;
        this.operatorForm.reset();
    }

  get formattedAddressPreview(): string {
    const address = this.operatorForm.get('address')?.value;
    const country = this.operatorForm.get('country')?.value;

    if (address && country?.city) {
      return `${address} - ${country.zipCode ?? ''} ${country.city} (${country.provinceCode ?? ''})`;
    }
    return '';
  }

  isFieldInvalid(field: string): boolean {
    const control = this.operatorForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  saveOperator() {
    if (this.operatorForm.valid) {
      const payload = this.operatorForm.value;
      // Handle create / update logic here
    }
  }
}
