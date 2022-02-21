package com.rozelux.springrestjsmvc.controllers;
import com.rozelux.springrestjsmvc.model.Role;
import com.rozelux.springrestjsmvc.service.RoleService;
import com.rozelux.springrestjsmvc.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class RestRolesController {

    final UserService userService;
    final RoleService roleService;

    public RestRolesController(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    @GetMapping("/roles")
    public ResponseEntity<List<Role>> showLoggedUser () {
        List <Role> roles = roleService.findAllRoles();
        return new ResponseEntity<>(roles, HttpStatus.OK);
    }
}
