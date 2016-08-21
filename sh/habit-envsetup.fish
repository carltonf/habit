# habit's envsetup support script
#
# source this file in the project envsetup.fish

# TODO The dependency on ENV is problematic as I see, maybe later we should
# migrate to '.habit/' directory option.
#
# NOTE env used by `habit`
set -x habit_working_post ''
function habit-cwp -d 'get/set cwp'
  if [ z"$argv" = z ]
    echo "*INFO: cwp is $post"
    return
  end
  # NOTE set post
  set post $argv
  set path ''
  if [ -e $post ]
    set path (realpath $post)
  else
    # NOTE try to be smart about $post
    set path __fish_habit_find_post $post
  end

  if [ -n $path ]
    echo "* INFO: set CWP to $post"
    set habit_working_post $path
  else
    echo "* Error: no post with name '$post'"
    return 1
  end

  # NOTE update the last_modified_at field
  habit-set-modified
  # NOTE make sure CWP is known to Git
  git add $habit_working_post
end

# TODO better to be in 'habit commit' as for now this only works for CWP
# TODO use the following to get the front matter line range to be more safer&accurate.
# : grep -m 2 -n '^---$' _drafts/boxize-my-development-setup.md  | cut -d':' -f1
function habit-set-modified -d 'set "last_modified_at" field for cwp'
  set today (date +%Y-%m-%d)

  # NOTE about adding date field:
  #
  # There is an issue with jekyll regenerating drafts without date field:
  # new changes always get skipped with "future date" warning.
  #
  grep '^date:' $habit_working_post
  if [ $status -ne 0 ]
    sed -i "/^title:/a date: $today" $habit_working_post
  end

  # NOTE subcommand substitution in fish will break current execution if
  # subcommand doesn't write its stdin (happens mostly when subcommand failed,
  # but it's not the only occasions) and thus the followings will not output
  # 'ab' as in Bash. (they outputs 'msg' and an extra newline)
  #
  # : echo a(ls -hjk)
  # : echo a(echo msg 1>&2)b  # an artificial case, note $status value will be 0
  #
  # (Hell, I guess every shell has its own idiosyncrasies) To get the same
  # effect, write something like (only works for failed cmd)
  #
  # : echo a(ls -lhj; or echo '')b
  #
  # TODO I honestly believe the above behavior is a bug. It's particularly
  # troublesome for command like `grep`.

  if [ z(grep '^last_modified_at:' $habit_working_post; or echo '') = z ]
    sed -i "/^title:/a last_modified_at: $today" $habit_working_post
  else
    sed -i "s/last_modified_at:.*/last_modified_at: $today/" $habit_working_post
  end
end

function __fish_habit_find_post -d 'search post path with post name'
  set found (find $TOP/_drafts $TOP/_posts $TOP/_wiki -path "*$argv" | head -1)
  # NOTE: Remember to quote, as $found is empty and '[ -n ]' return true. WTF...
  if [ -n "$found" ]
    realpath $found
  else
    echo ''
  end
end

source (dirname (status -f))'/habit-complete.fish'

set -x PATH $TOP/tools/node_modules/.bin $PATH
