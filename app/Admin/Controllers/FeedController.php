<?php

namespace App\Admin\Controllers;

use App\Admin\Actions\Feed\BatchEdit;
use App\Admin\Actions\Feed\ImportOpml;
use App\Models\Category;
use App\Models\Feed;
use Encore\Admin\Controllers\AdminController;
use Encore\Admin\Form;
use Encore\Admin\Grid;
use Encore\Admin\Show;
use Encore\Admin\Widgets\Table;
use App\Admin\Actions\Feed\Process;

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

        // Batch Edit
        $grid->batchActions(function ($batch) {
            $batch->add(new BatchEdit());
        });

        // Import OPML/Feedly
        $grid->tools(function (Grid\Tools $tools) {
            $tools->append(new ImportOpml());
        });

        $db_categories = Category::all();
        $categories = [];
        foreach ($db_categories as $category) {
            $categories[$category->id] = $category->title;
        }

        $grid->column('user_id', __('User id'));
        $grid->column('title', __('Title'))->expand(function (Feed $feed) {
            $sources = $feed->sources()->pluck('url', 'count');
            return new  Table(['Url', 'Count'], $sources->toArray());
        });
        $grid->column('last_sent', __('Sent'))->display(function ($value) {
            return strtotime($value) > 0 ? date('Y-m-d', strtotime($value)) : 'never';
        });
        $grid->column('status', __('Status'))->filter(config('enums.status'));
        $grid->column('period', __('Period'));
        $grid->column('schedule_day', __('Sc.Day'));
        $grid->column('schedule_time', __('Sc.Time'));
        $grid->column('type', __('Type'))->filter(config('enums.type'));
        $grid->column('category_id', __('Category'))->using($categories)->filter($categories);
        $grid->column('slug', __('Slug'));
        $grid->column('subscribers', __('Subs'))->display(function ($value) {
            return count($value);
        })->expand(function (Feed $feed) {
            $subscribers = $feed->subscribers()->pluck('first_name', 'last_name', 'kindle_email');
            return new  Table(['first_name', 'last_name', 'kindle_email'], $subscribers->toArray());
        });
        $grid->column('created_at', __('Created'))->display(function ($value) {
            return date('Y, M', strtotime($value));
        });

        // Append actions
        $grid->actions(function ($actions) {
            $actions->add(new Process);
        });

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
        $form->column(1/2, function (Form $form) {
            $categories = Category::all()->pluck('title', 'id');
            $form->number('user_id', __('User id'));
            $form->text('title', __('Title'));
            $form->datetime('last_sent', __('Last sent'))->default(date('Y-m-d H:i:s'));
            $form->text('status', __('Status'))->default('draft');
            $form->text('period', __('Period'));
            $form->number('schedule_day', __('Schedule day'));
            $form->number('schedule_time', __('Schedule time'));
            $form->text('type', __('Type'));
            $form->select('category_id', 'Category')->options($categories);
            $form->textarea('description', __('Description'));
            $form->text('slug', __('Slug'));
        });
        $form->column(1/2, function (Form $form) {
            $form->hasMany('sources', function (Form\NestedForm $form) {
                $form->text('url', __('URL'));
                $form->number('count', __('Limit'));
                $form->number('order', __('Order'));
            });
        });

//        $form->number('location_id', __('Location id'));
        return $form;
    }
}
