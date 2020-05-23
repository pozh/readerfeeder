<?php

namespace App\Admin\Controllers;

use App\Models\Feed;
use Encore\Admin\Controllers\AdminController;
use Encore\Admin\Form;
use Encore\Admin\Grid;
use Encore\Admin\Show;

class FeedController extends AdminController
{
    /**
     * Title for current resource.
     *
     * @var string
     */
    protected $title = 'Feed';

    /**
     * Make a grid builder.
     *
     * @return Grid
     */
    protected function grid()
    {
        $grid = new Grid(new Feed());

        $grid->column('id', __('Id'));
        $grid->column('user_id', __('User id'));
        $grid->column('title', __('Title'));
        $grid->column('last_sent', __('Last sent'));
        $grid->column('status', __('Status'));
        $grid->column('period', __('Period'));
        $grid->column('schedule_day', __('Schedule day'));
        $grid->column('schedule_time', __('Schedule time'));
        $grid->column('type', __('Type'));
        $grid->column('category_id', __('Category id'));
        $grid->column('description', __('Description'));
        $grid->column('slug', __('Slug'));
        $grid->column('subscribers', __('Subscribers'));
        $grid->column('created_at', __('Created at'));
        $grid->column('updated_at', __('Updated at'));
        $grid->column('location_id', __('Location id'));

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
        $show = new Show(Feed::findOrFail($id));

        $show->field('id', __('Id'));
        $show->field('user_id', __('User id'));
        $show->field('title', __('Title'));
        $show->field('last_sent', __('Last sent'));
        $show->field('status', __('Status'));
        $show->field('period', __('Period'));
        $show->field('schedule_day', __('Schedule day'));
        $show->field('schedule_time', __('Schedule time'));
        $show->field('type', __('Type'));
        $show->field('category_id', __('Category id'));
        $show->field('description', __('Description'));
        $show->field('slug', __('Slug'));
        $show->field('subscribers', __('Subscribers'));
        $show->field('created_at', __('Created at'));
        $show->field('updated_at', __('Updated at'));
        $show->field('location_id', __('Location id'));

        return $show;
    }

    /**
     * Make a form builder.
     *
     * @return Form
     */
    protected function form()
    {
        $form = new Form(new Feed());

        $form->number('user_id', __('User id'));
        $form->text('title', __('Title'));
        $form->datetime('last_sent', __('Last sent'))->default(date('Y-m-d H:i:s'));
        $form->text('status', __('Status'))->default('draft');
        $form->text('period', __('Period'));
        $form->number('schedule_day', __('Schedule day'));
        $form->number('schedule_time', __('Schedule time'));
        $form->text('type', __('Type'));
        $form->number('category_id', __('Category id'));
        $form->textarea('description', __('Description'));
        $form->text('slug', __('Slug'));
        $form->number('subscribers', __('Subscribers'));
        $form->number('location_id', __('Location id'));

        return $form;
    }
}
