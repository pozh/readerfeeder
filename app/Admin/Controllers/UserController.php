<?php

namespace App\Admin\Controllers;

use App\Models\User;
use Encore\Admin\Controllers\AdminController;
use Encore\Admin\Form;
use Encore\Admin\Grid;
use Encore\Admin\Show;

class UserController extends AdminController
{
    /**
     * Title for current resource.
     *
     * @var string
     */
    protected $title = 'User';

    /**
     * Make a grid builder.
     *
     * @return Grid
     */
    protected function grid()
    {
        $grid = new Grid(new User());

        $grid->column('id', __('Id'));
        $grid->column('first_name', __('First name'));
        $grid->column('last_name', __('Last name'));
        $grid->column('email', __('Email'));
        $grid->column('password', __('Password'));
        $grid->column('status', __('Status'));
        $grid->column('comments', __('Comments'));
        $grid->column('remember_token', __('Remember token'));
        $grid->column('email_token', __('Email token'));
        $grid->column('email_validation_date', __('Email validation date'));
        $grid->column('last_login_at', __('Last login at'));
        $grid->column('created_at', __('Created at'));
        $grid->column('updated_at', __('Updated at'));
        $grid->column('deleted_at', __('Deleted at'));
        $grid->column('settings', __('Settings'));
        $grid->column('kindle_email', __('Kindle email'));

        return $grid;
    }

    /**
     * Make a show builder.
     *
     * @param mixed $id
     * @return Show
     */
    protected function detail($id)
    {
        $show = new Show(User::findOrFail($id));

        $show->field('id', __('Id'));
        $show->field('first_name', __('First name'));
        $show->field('last_name', __('Last name'));
        $show->field('email', __('Email'));
        $show->field('password', __('Password'));
        $show->field('status', __('Status'));
        $show->field('comments', __('Comments'));
        $show->field('remember_token', __('Remember token'));
        $show->field('email_token', __('Email token'));
        $show->field('email_validation_date', __('Email validation date'));
        $show->field('last_login_at', __('Last login at'));
        $show->field('created_at', __('Created at'));
        $show->field('updated_at', __('Updated at'));
        $show->field('deleted_at', __('Deleted at'));
        $show->field('settings', __('Settings'));
        $show->field('kindle_email', __('Kindle email'));

        return $show;
    }

    /**
     * Make a form builder.
     *
     * @return Form
     */
    protected function form()
    {
        $form = new Form(new User());

        $form->text('first_name', __('First name'));
        $form->text('last_name', __('Last name'));
        $form->email('email', __('Email'));
        $form->password('password', __('Password'));
        $form->switch('status', __('Status'))->default(1);
        $form->textarea('comments', __('Comments'));
        $form->text('remember_token', __('Remember token'));
        $form->text('email_token', __('Email token'));
        $form->datetime('email_validation_date', __('Email validation date'))->default(date('Y-m-d H:i:s'));
        $form->datetime('last_login_at', __('Last login at'))->default(date('Y-m-d H:i:s'));
        $form->textarea('settings', __('Settings'));
        $form->text('kindle_email', __('Kindle email'));

        return $form;
    }
}
