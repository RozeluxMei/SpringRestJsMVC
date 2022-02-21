package com.rozelux.springrestjsmvc.controllers;

import com.rozelux.springrestjsmvc.model.User;
import com.rozelux.springrestjsmvc.service.RoleService;
import com.rozelux.springrestjsmvc.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class RestUsersController {

    final UserService userService;
    final RoleService roleService;

    public RestUsersController(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping("/users")
    public ResponseEntity<List<User>> showAllUsers(){
        List<User> users = userService.findAllUsers();
        if (users.isEmpty()){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(users, HttpStatus.OK);
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @GetMapping("/users/{id}")
    public ResponseEntity<User> showUser (@PathVariable("id") long id) {
        User user = userService.getUser(id);
        if (user == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PostMapping ("/users")
    public void addNewUser (@RequestBody User user) {
        userService.add(user);
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PutMapping ("/users")
    public void editUser (@RequestBody User user){
        userService.update(user);
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @DeleteMapping ("/users/{id}")
    public void deleteUser (@PathVariable("id") long id){
        userService.remove(id);
    }

    @GetMapping("/auth")
    public ResponseEntity<User> showLoggedUser (@AuthenticationPrincipal User user) {
        User authUser = userService.getUser(user.getId());
        return new ResponseEntity<>(authUser, HttpStatus.OK);
    }
}
